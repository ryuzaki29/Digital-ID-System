<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('student_number')->unique()->nullable();
            $table->string('full_name')->nullable();
            $table->string('email')->unique()->nullable();
            $table->string('program')->nullable();
            $table->string('year_level')->nullable();
            $table->enum('institution', [
                'University of the Philippines Diliman',
                'University of the Philippines Manila',
                'University of the Philippines Los Banos',
                'University of the Philippines Visayas',
                'University of the Philippines Baguio',
                'University of the Philippines Cebu',
                'University of the Philippines Mindanao',
                'University of the Philippines Open University',
                'University of the Philippines General Hospital',
                'University of the Philippines System',
                'University of the Philippines Tacloban'
            ])->nullable();
            $table->string('campus_site')->nullable();
            $table->string('college')->nullable();
            $table->string('organization')->nullable();
            $table->enum('status', ['Enrolled', 'Employed'])->nullable();
            $table->string('id_image')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
