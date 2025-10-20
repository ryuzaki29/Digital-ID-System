<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IDTemplateController extends Controller
{
    /**
     * Display the ID templates page.
     */
    public function index()
    {
        $students = Student::orderBy('updated_at', 'desc')
                          ->orderBy('created_at', 'desc')
                          ->get();

        return Inertia::render('id-templates', [
            'students' => $students,
        ]);
    }

    /**
     * Download a student's ID card.
     */
    public function download(Request $request, Student $student)
    {
        $template = $request->input('template', 'horizontal');
        
        // Here you would implement the actual ID generation and download
        // For now, we'll just return a JSON response
        return response()->json([
            'message' => 'Download functionality would generate and download the ID card',
            'student' => $student,
            'template' => $template,
        ]);
    }

    /**
     * Generate a print-ready version of a student's ID card.
     */
    public function print(Request $request, Student $student)
    {
        $template = $request->input('template', 'horizontal');
        
        // Here you would implement the actual ID generation for printing
        // For now, we'll just return a JSON response
        return response()->json([
            'message' => 'Print functionality would generate a print-ready ID card',
            'student' => $student,
            'template' => $template,
        ]);
    }
}