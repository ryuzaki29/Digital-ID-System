<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_number' => ['required', 'string', 'max:20', 'unique:students,student_number'],
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:students,email'],
            'program' => ['required', 'string', 'max:255'],
            'year_level' => ['required', 'string', 'max:10'],
            'institution' => ['nullable', 'string', 'in:University of the Philippines Diliman,University of the Philippines Manila,University of the Philippines Los Banos,University of the Philippines Visayas,University of the Philippines Baguio,University of the Philippines Cebu,University of the Philippines Mindanao,University of the Philippines Open University,University of the Philippines General Hospital,University of the Philippines System,University of the Philippines Tacloban'],
            'campus_site' => ['nullable', 'string', 'max:255'],
            'college' => ['required', 'string', 'max:255'],
            'organization' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'in:Enrolled,Employed'],
            'id_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('id_image')) {
            $imagePath = $request->file('id_image')->store('student-images', 'public');
        }

        $student = Student::create([
            ...$validated,
            'id_image' => $imagePath,
            'user_id' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Student information saved successfully!');
    }

    public function batchUpload(Request $request)
    {
        $request->validate([
            'csv_file' => ['required', 'file', 'mimes:csv,txt', 'max:2048'],
        ]);

        $file = $request->file('csv_file');
        $csvData = file_get_contents($file->getRealPath());
        $lines = explode("\n", $csvData);
        
        // Remove header line
        array_shift($lines);
        
        $successCount = 0;
        $errorCount = 0;
        $errors = [];

        foreach ($lines as $index => $line) {
            $line = trim($line);
            if (empty($line)) continue;
            
            $data = str_getcsv($line);
            
            // Ensure we have the right number of columns
            if (count($data) < 10) {
                $errors[] = "Line " . ($index + 2) . ": Invalid format - expected 10 columns";
                $errorCount++;
                continue;
            }

            try {
                Student::create([
                    'student_number' => trim($data[0]),
                    'full_name' => trim($data[1]),
                    'email' => trim($data[2]),
                    'program' => trim($data[3]),
                    'year_level' => trim($data[4]),
                    'institution' => !empty(trim($data[5])) ? trim($data[5]) : null,
                    'campus_site' => !empty(trim($data[6])) ? trim($data[6]) : null,
                    'college' => trim($data[7]),
                    'organization' => !empty(trim($data[8])) ? trim($data[8]) : null,
                    'status' => !empty(trim($data[9])) ? trim($data[9]) : null,
                    'user_id' => Auth::id(),
                ]);
                $successCount++;
            } catch (\Exception $e) {
                $errors[] = "Line " . ($index + 2) . ": " . $e->getMessage();
                $errorCount++;
            }
        }

        $message = "Batch upload completed: {$successCount} students added successfully";
        if ($errorCount > 0) {
            $message .= ", {$errorCount} errors occurred";
        }

        return redirect()->back()->with('success', $message);
    }

    public function downloadSampleCsv()
    {
        $csvContent = "student_number,full_name,email,program,year_level,institution,campus_site,college,organization,status\n";
        $csvContent .= "2021-123456,John Doe,john.doe@example.com,Computer Science,4th Year,University of the Philippines Diliman,Main Campus,College of Engineering,Computer Society,Enrolled\n";
        $csvContent .= "2021-123457,Jane Smith,jane.smith@example.com,Information Technology,3rd Year,University of the Philippines Manila,Ermita Campus,College of Engineering,IT Guild,Enrolled\n";
        $csvContent .= "2021-123458,Mike Johnson,mike.johnson@example.com,Business Administration,2nd Year,University of the Philippines Diliman,Main Campus,College of Business,Business Club,Enrolled\n";
        $csvContent .= "2021-123459,Sarah Wilson,sarah.wilson@example.com,Psychology,1st Year,University of the Philippines Baguio,Main Campus,College of Liberal Arts,Psychology Society,Enrolled\n";

        return response($csvContent, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="sample_students.csv"',
        ]);
    }

    public function index()
    {
        $students = Student::where('user_id', Auth::id())
            ->select('id', 'full_name', 'student_number', 'email', 'program', 'year_level', 'institution', 'campus_site', 'college', 'organization', 'status', 'id_image')
            ->get();
        return response()->json($students);
    }

    public function indexForPage()
    {
        $students = Student::where('user_id', Auth::id())
            ->select('id', 'full_name', 'student_number', 'email', 'program', 'year_level', 'institution', 'campus_site', 'college', 'organization', 'status', 'id_image')
            ->get();
        return $students;
    }

    public function update(Request $request, Student $student)
    {
        // Ensure the student belongs to the current user
        if ($student->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'student_number' => ['required', 'string', 'max:20', Rule::unique('students', 'student_number')->ignore($student->id)],
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('students', 'email')->ignore($student->id)],
            'program' => ['required', 'string', 'max:255'],
            'year_level' => ['required', 'string', 'max:10'],
            'institution' => ['nullable', 'string', 'in:University of the Philippines Diliman,University of the Philippines Manila,University of the Philippines Los Banos,University of the Philippines Visayas,University of the Philippines Baguio,University of the Philippines Cebu,University of the Philippines Mindanao,University of the Philippines Open University,University of the Philippines General Hospital,University of the Philippines System,University of the Philippines Tacloban'],
            'campus_site' => ['nullable', 'string', 'max:255'],
            'college' => ['required', 'string', 'max:255'],
            'organization' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'in:Enrolled,Employed'],
            'id_image' => ['nullable'],
        ]);

        // Handle image operations
        if ($request->hasFile('id_image')) {
            // Delete old image if exists
            if ($student->id_image) {
                Storage::disk('public')->delete($student->id_image);
            }
            $validated['id_image'] = $request->file('id_image')->store('student-images', 'public');
        } elseif ($request->input('id_image') === 'REMOVE') {
            // Delete old image if exists
            if ($student->id_image) {
                Storage::disk('public')->delete($student->id_image);
            }
            $validated['id_image'] = null;
        } else {
            // Remove id_image from validated data if not being changed
            unset($validated['id_image']);
        }

        $student->update($validated);

        return redirect()->back()->with('success', 'Student information updated successfully!');
    }

    public function destroy(Student $student)
    {
        // Ensure the student belongs to the current user
        if ($student->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        // Delete image file if exists
        if ($student->id_image) {
            Storage::disk('public')->delete($student->id_image);
        }

        $student->delete();

        return redirect()->back()->with('success', 'Student deleted successfully!');
    }

    public function showStudentInformation()
    {
        $students = Student::where('user_id', Auth::id())
            ->select('id', 'full_name', 'student_number', 'email', 'program', 'year_level', 'institution', 'campus_site', 'college', 'organization', 'status', 'id_image', 'created_at', 'updated_at')
            ->orderBy('updated_at', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('student-information', [
            'students' => $students
        ]);
    }

    public function showStudentId()
    {
        $students = Student::where('user_id', Auth::id())
            ->select('id', 'full_name', 'student_number', 'email', 'program', 'year_level', 'institution', 'campus_site', 'college', 'organization', 'status', 'id_image')
            ->get();
        
        return Inertia::render('student-id', [
            'students' => $students
        ]);
    }
}
