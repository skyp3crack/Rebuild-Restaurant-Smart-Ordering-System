{{-- index.blade.php: Just a simple list with an "Add New" button. --}}
<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                {{ __('Manage Menu Items') }}
            </h2>
            <a href="{{ route('categories.create') }}"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                + Add New Item
            </a>
        </div>
    </x-slot>

    {{-- show existing categories--}}
    <div class="py-12">
        <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                @if ($categories->count() > 0)
                    <div class="space-y-4">
                        @foreach ($categories as $category)
                            <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div>
                                    <h3 class="font-semibold text-lg">{{ $category->name }}</h3>
                                    <p class="text-sm text-gray-500">{{ $category->description }}</p>
                                </div>
                                <div class="flex space-x-2">
                                    <form action="{{ route('categories.destroy', $category->id) }}" method="POST">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit"
                                            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                        @endforeach
                    </div>
                @else
                    <p class="text-gray-500 dark:text-gray-400">No categories found.</p>
                @endif
            </div>
        </div>
    </div>
</x-app-layout>