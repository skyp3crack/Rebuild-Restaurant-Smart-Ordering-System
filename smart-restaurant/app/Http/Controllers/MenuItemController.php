<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function index()
    {
        // Fetch all menu items from the database
        $menuItems = MenuItem::all();
        // Pass them to a view called 'menu.index'
        return view('menu.index', compact('menuItems'));
    }

    // We will fill in create(), store(), edit(), update(), destroy() 
    public function create()
    {
        // Since a menu item REQUIRES a category, we will automatically 
        // create a default one right now if your database doesn't have any yet.
        if (Category::count() == 0) {
            Category::create(['name' => 'Main Course']);
        }
        $categories = Category::all();
        return view('menu.create', compact('categories'));
    }

    public function store(Request $request)
    {
        //1. validate the form
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        //hanlde the file upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('menu_images', 'public');
            $validated['image'] = $path;
        }

        // 2. Save it to the database
        MenuItem::create($validated);

        // 3. Redirect back to the dashboard
        return redirect()->route('menu.index');
    }

    public function edit($id)
    {
        $menuItem = MenuItem::findOrFail($id);
        $categories = Category::all();

        return view('menu.edit', compact('menuItem', 'categories'));
    }

    public function update(Request $request, $id)
    {
        // 1. Validate the incoming data (CRUCIAL: The 'image' rule must be here!)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        // 2. Find the existing item
        $menuItem = MenuItem::findOrFail($id);

        // 3. Handle the image upload IF a new image was selected
        if ($request->hasFile('image')) {
            // Save the new file to the public storage
            $path = $request->file('image')->store('menu_images', 'public');

            // Add the new path to our $validated array so the database updates it
            $validated['image_path'] = $path;
        }

        // 4. Update the database record with the new text AND the new image path
        $menuItem->update($validated);

        return redirect()->route('menu.index')->with('success', 'Menu item updated successfully!');
    }

    public function destroy($id)
    {
        $menuItem = MenuItem::findOrFail($id);
        $menuItem->delete();

        return redirect()->route('menu.index');
    }
}