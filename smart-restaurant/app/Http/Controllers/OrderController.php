<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function showMenu($table_number)
    {

        //fetch categories with their avalaiable menu items
        $categories = Category::with([
            'menuItems' => function ($query) {
                $query->where('is_available', true);
            }
        ])->get();

        return view('customer.menu', compact('categories', 'table_number'));
    }
}
