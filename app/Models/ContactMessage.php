<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name', 'email', 'message'])]
class ContactMessage extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;
}
