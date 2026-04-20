<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                {{ __('Kitchen Dashboard (Pending Orders)') }}
            </h2>
            <button onclick="window.location.reload()"
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                Refresh Page
            </button>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">

            @if(session('success'))
                <div class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                    {{ session('success') }}
                </div>
            @endif

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @forelse($orders as $order)
                    <div
                        class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border-l-4 border-yellow-500">
                        <div class="p-6 text-gray-900 dark:text-gray-100">
                            <div class="flex justify-between items-center border-b dark:border-gray-700 pb-3 mb-3">
                                <h3 class="font-bold text-lg">Table {{ $order->table_number }}</h3>
                                <span class="text-sm text-gray-500">Order #{{ $order->id }}</span>
                            </div>

                            <ul class="mb-4 space-y-2">
                                @foreach($order->orderItems as $item)
                                    <li class="flex justify-between">
                                        <span class="font-semibold">{{ $item->quantity }}x</span>
                                        <span class="flex-1 ml-2">{{ $item->menuItem->name ?? 'Deleted Item' }}</span>
                                    </li>
                                @endforeach
                            </ul>

                            {{-- Special Instructions / Order Notes --}}
                            @if($order->notes)
                                <div class="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                                    <p class="text-xs font-bold text-yellow-800 dark:text-yellow-300 uppercase tracking-wide mb-1">📝 Special Instructions</p>
                                    <p class="text-sm text-yellow-900 dark:text-yellow-100">{{ $order->notes }}</p>
                                </div>
                            @endif

                            <form action="{{ route('kitchen.complete', $order->id) }}" method="POST">
                                @csrf
                                <button type="submit"
                                    class="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                    Mark as Completed
                                </button>
                            </form>
                        </div>
                    </div>
                @empty
                    <div
                        class="col-span-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-center text-gray-500 dark:text-gray-400">
                        No pending orders! The kitchen is clear.
                    </div>
                @endforelse
            </div>
        </div>
    </div>
</x-app-layout>