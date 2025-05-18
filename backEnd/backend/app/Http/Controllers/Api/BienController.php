<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bien;
use Illuminate\Http\Request;

class BienController extends Controller
{
    public function index(Request $request)
    {
        $query = Bien::query();

        if ($request->ville) {
            $query->where('ville', 'like', '%' . $request->ville . '%');
        }

        if ($request->type) {
            $query->where('type', $request->type);
        }

        if ($request->prixMax) {
            $query->where('prix', '<=', $request->prixMax);
        }

        $biens = $query->get();

        return response()->json($biens);
    }
}
