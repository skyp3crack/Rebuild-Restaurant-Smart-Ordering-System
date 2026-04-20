<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menu - Table {{ $table_number }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gray-100 text-gray-900 font-sans antialiased p-4">

    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        @if(session('success'))
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative m-4" role="alert">
                <strong class="font-bold">Yay!</strong>
                <span class="block sm:inline">{{ session('success') }}</span>
            </div>
        @endif

        <div class="p-6 bg-blue-600 text-white text-center">
            <h1 class="text-2xl font-bold">Our Menu</h1>
            <p class="text-sm">Ordering for Table {{ $table_number }}</p>
        </div>

        <div class="p-4">
            @foreach($categories as $category)
                @if($category->menuItems->count() > 0)
                    <h2 class="text-xl font-bold mt-6 mb-4 border-b-2 border-gray-200 pb-2">{{ $category->name }}</h2>

                    <div class="space-y-4">
                        @foreach($category->menuItems as $item)
                            <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div>
                                    @if($item->image_path) {{-- check if item has image --}}
                                        <img src="{{ asset('storage/' . $item->image_path) }}" alt="{{ $item->name }}"
                                            class="w-20 h-20 object-cover rounded-md mr-4 shadow-sm">
                                    @else   
                                        <div
                                            class="w-20 h-20 bg-gray-200 rounded-md mr-4 flex items-center justify-center text-gray-400">
                                            No Image</div>
                                    @endif
                                    <h3 class="font-semibold text-lg">{{ $item->name }}</h3>
                                    <p class="text-sm text-gray-500">{{ $item->description }}</p>
                                    <p class="font-bold text-blue-600 mt-1">${{ number_format($item->price, 2) }}</p>
                                </div>
                                <form action="{{ route('customer.cart.add', $table_number) }}" method="POST">
                                    @csrf
                                    <input type="hidden" name="menu_item_id" value="{{ $item->id }}">
                                    <button type="submit"
                                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow">
                                        Add
                                    </button>
                                </form>
                            </div>
                        @endforeach
                    </div>
                @endif
            @endforeach
        </div>
    </div>

    @php $cart = session("cart_{$table_number}"); //this is to get the cart from the session
    @endphp
    
    
    @if($cart && count($cart) > 0) 
        <div class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg p-4">
            <div class="max-w-md mx-auto">
                <h3 class="font-bold text-lg mb-2">Your Cart</h3>
                <div class="max-h-32 overflow-y-auto mb-2 text-sm">
                    @php $total = 0; @endphp
                    @foreach($cart as $id => $details)
                        @php $total += $details['price'] * $details['quantity']; @endphp
                        <div class="flex justify-between items-center mb-2 border-b border-gray-100 pb-2">
                            <div class="flex items-center space-x-2">
                                <form action="{{ route('customer.cart.remove', $table_number) }}" method="POST">
                                    @csrf
                                    <input type="hidden" name="menu_item_id" value="{{ $id }}">
                                    <button type="submit" class="bg-red-500 hover:bg-red-600 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm">-</button>
                                </form>

                                <span class="font-bold w-4 text-center">{{ $details['quantity'] }}</span>

                                <form action="{{ route('customer.cart.add', $table_number) }}" method="POST">
                                    @csrf
                                    <input type="hidden" name="menu_item_id" value="{{ $id }}">
                                    <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm">+</button>
                                </form>

                                <span class="ml-2 text-gray-800">{{ $details['name'] }}</span>
                            </div>
                            <span class="font-bold text-gray-700">${{ number_format($details['price'] * $details['quantity'], 2) }}</span>
                        </div>
                    @endforeach
                </div>
                
                {{-- Special Instructions / Order Notes --}}
                <div class="border-t pt-3 mt-2">
                    <form action="{{ route('customer.checkout', $table_number) }}" method="POST">
                        @csrf
                        <label for="order-notes" class="block text-sm font-semibold text-gray-700 mb-1">
                            📝 Special Instructions
                        </label>
                        <textarea
                            id="order-notes"
                            name="notes"
                            rows="2"
                            maxlength="500"
                            placeholder="e.g. No onions, extra spicy, allergies…"
                            class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
                            oninput="document.getElementById('char-count').textContent = this.value.length"
                        ></textarea>
                        <p class="text-xs text-gray-400 text-right mt-1">
                            <span id="char-count">0</span> / 500
                        </p>

                        <div class="flex justify-between items-center mt-3">
                            <span class="font-bold text-xl">Total: ${{ number_format($total, 2) }}</span>
                            <button type="submit" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow">
                                Checkout
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="pb-40"></div>
    @endif
</body>

</html>