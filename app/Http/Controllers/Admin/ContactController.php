<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
// use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        $messages = ContactMessage::latest()->paginate(10);

        // 1. Stats untuk Card
        $totalMessages = ContactMessage::count();
        $thisMonthMessages = ContactMessage::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $todayMessages = ContactMessage::whereDate('created_at', now()->today())->count();

        // 2. Data untuk Line Chart (Pesan per bulan, 6 bulan terakhir)
        $chartData = ContactMessage::where('created_at', '>=', now()->subMonths(6)->startOfMonth())
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
            $key = $date->format('Y-m');
            $labels[] = $date->format('M');
            $data[] = $chartData[$key] ?? 0;
        }

        return inertia('admin/messages/index', [
            'messages' => $messages,
            'stats' => [
                'total' => $totalMessages,
                'this_month' => $thisMonthMessages,
                'today' => $todayMessages,
            ],
            'chart' => [
                'labels' => $labels,
                'data' => $data,
            ],
        ]);
    }

    public function destroy($id)
    {
        $contactMessage = ContactMessage::findOrFail($id);
        
        $contactMessage->delete();

        return back()->with('success', 'Pesan berhasil dihapus.');
    }
}