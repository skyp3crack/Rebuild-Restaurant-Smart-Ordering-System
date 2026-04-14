<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Edit Menu Item: ') }} {{ $menuItem->name }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                @if ($errors->any())
                    <div class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <strong class="font-bold">Oops! There were some problems:</strong>
                        <ul class="mt-2 list-disc list-inside text-sm">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif
                <form action="{{ route('menu.update', $menuItem->id) }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @method('PUT') <div class="mb-4">
                        <label class="block text-gray-700 dark:text-gray-300 font-bold mb-2">Item Name</label>
                        <input type="text" name="name" value="{{ $menuItem->name }}" required
                            class="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm">
                    </div>

                    <div class="mb-4">
                        <label class="block text-gray-700 dark:text-gray-300 font-bold mb-2">Price ($)</label>
                        <input type="number" step="0.01" name="price" value="{{ $menuItem->price }}" required
                            class="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm">
                    </div>

                    <div class="mb-4">
                        <label class="block text-gray-700 dark:text-gray-300 font-bold mb-2">Category</label>
                        <select name="category_id" required
                            class="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm">
                            @foreach($categories as $category)
                                <option value="{{ $category->id }}" {{ $menuItem->category_id == $category->id ? 'selected' : '' }}>
                                    {{ $category->name }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <div class="mb-6">
                        <label class="block text-gray-700 dark:text-gray-300 font-bold mb-2">Description</label>
                        <textarea name="description" rows="3"
                            class="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm">{{ $menuItem->description }}</textarea>
                    </div>

                    <div
                        class="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                        <label class="block text-gray-700 dark:text-gray-300 font-bold mb-2">Current Image</label>

                        @if($menuItem->image_path) {{-- if image saved, used asset storage to generate correct url --}}
                            <div class="mb-4">
                                <img src="{{ asset('storage/' . $menuItem->image_path) }}" alt="{{ $menuItem->name }}"
                                    class="w-32 h-32 object-cover rounded-md shadow-sm border border-gray-300 dark:border-gray-500">
                            </div>
                        @else
                            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 italic">No image currently uploaded.</p>
                        @endif

                        <label class="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                            {{ $menuItem->image_path ? 'Upload New Image to Replace' : 'Upload Image' }}
                        </label>
                        <input type="file" name="image" accept="image/*"
                            class="w-full text-gray-700 dark:text-gray-300">
                    </div>

                    <div class="flex justify-end">
                        <a href="{{ route('menu.index') }}"
                            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">
                            Cancel
                        </a>
                        <button type="submit"
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Update Item
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</x-app-layout>