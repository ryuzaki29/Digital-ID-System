<?php

use App\Http\Controllers\StudentController;
use App\Http\Controllers\IDTemplateController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    Route::get('student-information', [StudentController::class, 'showStudentInformation'])->name('student_information');
    
    Route::get('student-id', [StudentController::class, 'showStudentId'])->name('student_id');
    
    // ID Template routes
    Route::get('id-templates', [IDTemplateController::class, 'index'])->name('id_templates');
    Route::post('id-templates/{student}/download', [IDTemplateController::class, 'download'])->name('id_templates.download');
    Route::post('id-templates/{student}/print', [IDTemplateController::class, 'print'])->name('id_templates.print');
    
    // Student routes
    Route::post('students', [StudentController::class, 'store'])->name('students.store');
    Route::post('students/batch-upload', [StudentController::class, 'batchUpload'])->name('students.batch_upload');
    Route::get('students/sample-csv', [StudentController::class, 'downloadSampleCsv'])->name('students.sample_csv');
    Route::get('students', [StudentController::class, 'index'])->name('students.index');
    Route::put('students/{student}', [StudentController::class, 'update'])->name('students.update');
    Route::delete('students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');
    
    // Debug route
    Route::get('debug/students', function() {
        return response()->json(\App\Models\Student::where('user_id', auth()->id())->get());
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
