<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;

class OrderController extends Controller
{
    public function showMenu($table_number)
    {

        //fetch categories with their avalaiable menu items
        $categories = Category::with([
            'menuItems' => function ($query) {
                $query->where('is_available', true);
            }
        ])->get();

        return view('customer.menu', compact('categories', 'table_number'));
    }

    public function addToCart(Request $request, $table_number)
    {
        $request->validate([
            'menu_item_id' => 'required|exists:menu_items,id'
        ]);

        $item = MenuItem::findOrFail($request->menu_item_id);

        // Retrieve the current cart from the session, or start an empty array
        $cart = session()->get("cart_{$table_number}", []);

        // If the item is already in the cart, just increase the quantity
        if (isset($cart[$item->id])) {
            $cart[$item->id]['quantity']++;
        } else {
            // Otherwise, add the new item details
            $cart[$item->id] = [
                "name" => $item->name,
                "quantity" => 1,
                "price" => $item->price,
            ];
        }

        // Save the updated cart back to the session
        session()->put("cart_{$table_number}", $cart);

        return redirect()->back()->with('success', $item->name . ' added to cart!');
    }

    public function removeFromCart(Request $request, $table_number)
    {
        $request->validate([
            'menu_item_id' => 'required|exists:menu_items,id'
        ]);

        $cart = session()->get("cart_{$table_number}", []);
        $id = $request->menu_item_id;

        // If the item exists in the cart, decrease the quantity
        if (isset($cart[$id])) {
            $cart[$id]['quantity']--;

            // If the quantity hits 0, remove the item from the session entirely
            if ($cart[$id]['quantity'] <= 0) {
                unset($cart[$id]);
            }

            // Save the updated cart back to the session
            session()->put("cart_{$table_number}", $cart);
        }

        return redirect()->back();
    }

    public function checkout(Request $request, $table_number)
    {
        $cart = session()->get("cart_{$table_number}");

        // Prevent checking out with an empty cart
        if (!$cart || count($cart) == 0) {
            return redirect()->back();
        }

        // 1. Calculate the final total price
        $total_price = 0;
        foreach ($cart as $details) {
            $total_price += $details['price'] * $details['quantity'];
        }

        // 2. Create the main Order record
        $order = Order::create([
            'table_number' => $table_number,
            'status' => 'pending',
            'total_price' => $total_price,
        ]);

        // 3. Create the individual Order Item records
        foreach ($cart as $id => $details) {
            OrderItem::create([
                'order_id' => $order->id,
                'menu_item_id' => $id,
                'quantity' => $details['quantity'],
            ]);
        }

        // 4. Clear the temporary cart from the session
        session()->forget("cart_{$table_number}");

        // 5. Redirect back with a success message
        return redirect()->route('customer.menu', $table_number)->with('success', 'Order placed successfully! The kitchen is preparing your food.');
    }
}
