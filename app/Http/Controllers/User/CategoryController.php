<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('user/categories/index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
            'color' => 'required|string|max:7',
        ]);

        Category::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Kategori berhasil ditambahkan!');
    }

    // public function update(Request $request, Category $category)
    // {
    //     abort_if($category->user_id !== auth()->id(), 403);

    //     $validated = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'type' => 'required|in:income,expense',
    //         'color' => 'required|string|max:7',
    //     ]);

    //     $category->update($validated);

    //     return redirect()->back()->with('success', 'Kategori berhasil diperbarui!');
    // }

    public function destroy(Category $category)
    {
        abort_if($category->user_id !== auth()->id(), 403);

        if ($category->transactions()->exists()) {
            return redirect()->back()->with(
                'error',
                'Kategori tidak bisa dihapus karena masih dipakai transaksi.'
            );
        }

        $category->delete();

        return redirect()->back()->with('success', 'Kategori berhasil dihapus!');
    }
}