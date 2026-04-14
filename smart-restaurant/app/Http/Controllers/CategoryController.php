<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::all(); //fetch all categories from database
        return view('categories.index', compact('categories')); //pass them to a view called 'categories.index'
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('categories.create'); //return a view called 'categories.create'
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([ //check if the form is filled correctly
            'name' => 'required|string|max:255|unique:categories', //with the same name as another category
        ]);

        Category::create($validated); //save it to database
        return redirect()->route('categories.index')->with('sucess', 'Category created successfully'); //redirect to categories with message
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $category = Category::find($id); //find the category
        return view('categories.edit', compact('category')); //pass it to a view called 'categories.edit'
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
        ]);

        $category = Category::find($id);
        $category->update($validated);

        return redirect()->route('categories.index')->with('success', 'Category updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::find($id);
        $category->delete();   //delete the category
        return redirect()->route('categories.index')->with('success', 'Category deleted successfully');
    }
}
