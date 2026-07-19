<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::where('id', '!=', auth()->id())
            ->when($request->search, fn($q, $search) =>
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
            )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // 1. Stats untuk Card Role
        $totalUsers = User::where('id', '!=', auth()->id())->count();
        $adminCount = User::where('role', 'admin')->count();
        $userCount = $totalUsers - $adminCount;

        // 2. Data untuk Chart (SUDAH DIFIX: Pakai format yang sama '%Y-%m')
        $chartData = User::where('id', '!=', auth()->id())
            ->where('created_at', '>=', now()->subMonths(6)->startOfMonth())
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month_key, COUNT(*) as count")
            ->groupByRaw("DATE_FORMAT(created_at, '%Y-%m')")
            ->orderByRaw("DATE_FORMAT(created_at, '%Y-%m') ASC")
            ->get()
            ->pluck('count', 'month_key')
            ->toArray();

        $labels = [];
        $data = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $key = $date->format('Y-m'); // Contoh: 2024-08
            $labels[] = $date->format('M'); // Contoh: Agu
            $data[] = $chartData[$key] ?? 0;
        }

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'stats' => [
                'total' => $totalUsers,
                'admin_count' => $adminCount,
                'user_count' => $userCount,
            ],
            'chart' => [
                'labels' => $labels,
                'data' => $data,
            ],
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'role' => 'required|in:admin,user',
        ]);

        $user = User::findOrFail($id);

        $user->update([
            'role' => $request->role,
        ]);

        return redirect()->back()->with('success', 'Akses hak role user berhasil diubah!');
    }

    public function destroy(string $id)
    {
        //
    }
}