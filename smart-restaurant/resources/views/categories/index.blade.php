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
</x-app-layout>