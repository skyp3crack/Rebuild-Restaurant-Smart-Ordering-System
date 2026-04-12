<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['table_number', 'status', 'total_price'];

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
