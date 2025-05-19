<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UsersController extends Controller
{
    public function show($id)
{
    $user = User::find($id);
    if (!$user) {
        return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
    }
    return response()->json($user);
}
    // ✅ Inscription
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:admin,acheteur,vendeur',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
                'input' => $request->all()
            ], 422);
        }

        // ✅ Bloquer l'inscription s'il y a déjà un admin
        if ($request->role === 'admin' && User::where('role', 'admin')->exists()) {
            return response()->json(['message' => 'Un administrateur existe déjà.'], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json(['token' => $token, 'user' => $user]);
    }

    // ✅ Connexion
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
                'input' => $request->all()
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        if ($token = JWTAuth::attempt($credentials)) {
            $user = JWTAuth::user();
            return response()->json(['token' => $token, 'user' => $user]);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }

    // ✅ Ajoute ceci pour que l'admin voie les utilisateurs
    public function getAllUsers()
    {
        $user = JWTAuth::parseToken()->authenticate();

        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $users = User::where('role', '!=', 'admin')->get(); // exclure l’admin

        return response()->json($users);
    }

    public function logout(Request $request)
{
    try {
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['message' => 'Déconnexion réussie.']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Erreur lors de la déconnexion.'], 500);
    }
}
public function update(Request $request, $id)
{
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
    }

    $validator = Validator::make($request->all(), [
        'name' => 'sometimes|string|max:255',
        'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
        'password' => 'nullable|string|min:8|confirmed',
        'role' => 'sometimes|string|in:admin,acheteur,vendeur',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $user->update([
        'name' => $request->name ?? $user->name,
        'email' => $request->email ?? $user->email,
        'role' => $request->role ?? $user->role,
        'password' => $request->password ? Hash::make($request->password) : $user->password,
    ]);

    return response()->json(['message' => 'Utilisateur mis à jour.', 'user' => $user]);
}
public function destroy($id)
{
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
    }

    $user->delete();

    return response()->json(['message' => 'Utilisateur supprimé avec succès.']);
}
public function index()
{
    $users = User::all();
    return response()->json($users);
}


}
