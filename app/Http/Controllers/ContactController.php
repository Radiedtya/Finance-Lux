<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:2000',
        ]);

        ContactMessage::create($validated);

        return redirect()->back()->with('success', 'Pesan kamu berhasil terkirim. Tim kami akan segera merespons.');
    }
}