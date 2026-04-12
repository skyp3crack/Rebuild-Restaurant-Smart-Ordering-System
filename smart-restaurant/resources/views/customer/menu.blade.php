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
                                    <h3 class="font-semibold text-lg">{{ $item->name }}</h3>
                                    <p class="text-sm text-gray-500">{{ $item->description }}</p>
                                    <p class="font-bold text-blue-600 mt-1">${{ number_format($item->price, 2) }}</p>
                                </div>
                                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow">
                                    Add
                                </button>
                            </div>
                        @endforeach
                    </div>
                @endif
            @endforeach
        </div>
    </div>

</body>

</html>