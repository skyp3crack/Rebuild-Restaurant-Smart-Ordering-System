<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                {{ __('Manage Menu Items') }}
            </h2>
            <a href="{{ route('menu.create') }}"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                + Add New Item
            </a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">

                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th class="border-b dark:border-gray-600 p-3">Name</th>
                                <th class="border-b dark:border-gray-600 p-3">Price</th>
                                <th class="border-b dark:border-gray-600 p-3">Status</th>
                                <th class="border-b dark:border-gray-600 p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($menuItems as $item)
                                <tr>
                                    <td class="border-b dark:border-gray-700 p-3">{{ $item->name }}</td>
                                    <td class="border-b dark:border-gray-700 p-3">${{ $item->price }}</td>
                                    <td class="border-b dark:border-gray-700 p-3">
                                        {{ $item->is_available ? 'Available' : 'Sold Out' }}
                                    </td>
                                    <td class="border-b dark:border-gray-700 p-3 flex space-x-2">
                                        <a href="{{ route('menu.edit', $item->id) }}"
                                            class="text-blue-500 hover:text-blue-700 font-bold">Edit</a>

                                        <span class="text-gray-500">|</span>

                                        <form action="{{ route('menu.destroy', $item->id) }}" method="POST"
                                            onsubmit="return confirm('Are you sure you want to delete this item?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit"
                                                class="text-red-500 hover:text-red-700 font-bold">Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="p-3 text-center text-gray-500">No menu items found.</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    </div>
</x-app-layout>