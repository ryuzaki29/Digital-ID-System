<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Student extends Model
{
    protected $fillable = [
        'student_number',
        'full_name',
        'email',
        'program',
        'year_level',
        'institution',
        'campus_site',
        'college',
        'organization',
        'status',
        'id_image',
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
