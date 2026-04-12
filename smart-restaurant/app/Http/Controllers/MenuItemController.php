<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function index()
    {
        // Fetch all menu items from the database
        $menuItems = MenuItem::all();

        // Pass them to a view called 'menu.index'
        return view('index', compact('menuItems'));
    }

    // We will fill in create(), store(), edit(), update(), destroy() next!
}