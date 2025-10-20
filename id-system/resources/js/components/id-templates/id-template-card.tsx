import { Student } from '@/types';
import { User, GraduationCap, Building, Mail, Hash } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface IDTemplateProps {
    student: Student;
    template: 'horizontal' | 'vertical' | 'compact';
    className?: string;
}

export function IDTemplateCard({ student, template, className = '' }: IDTemplateProps) {
    const getImageUrl = (imagePath?: string | null) => {
        if (!imagePath) return null;
        return `/storage/${imagePath}`;
    };

    const formatCollege = (college: string) => {
        return college.replace(/^college-of-|^college-/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatProgram = (program: string) => {
        return program.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (template === 'horizontal') {
        return (
            <Card className={`w-[400px] h-[250px] bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden relative ${className}`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white translate-y-12 -translate-x-12"></div>
                </div>
                
                <div className="relative z-10 p-6 h-full flex">
                    {/* Left Side - Photo */}
                    <div className="flex-shrink-0 mr-6">
                        <div className="w-24 h-32 bg-white rounded-lg overflow-hidden shadow-lg border-2 border-white">
                            {getImageUrl(student.id_image) ? (
                                <img 
                                    src={getImageUrl(student.id_image)!} 
                                    alt={student.full_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <User className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Information */}
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <div className="mb-1">
                                <h1 className="text-xl font-bold leading-tight">{student.full_name}</h1>
                                <p className="text-blue-100 text-sm font-mono">{student.student_number}</p>
                            </div>
                            
                            <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="w-3 h-3" />
                                    <span className="text-blue-100">{formatProgram(student.program)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building className="w-3 h-3" />
                                    <span className="text-blue-100">{formatCollege(student.college)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Hash className="w-3 h-3" />
                                    <span className="text-blue-100">{student.year_level} Year</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="bg-white/20 rounded px-3 py-1 text-xs">
                                <Mail className="w-3 h-3 inline mr-1" />
                                {student.email}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Institution Name */}
                <div className="absolute bottom-2 right-4">
                    <p className="text-xs text-blue-200 font-semibold">UNIVERSITY DIGITAL ID</p>
                </div>
            </Card>
        );
    }

    if (template === 'vertical') {
        return (
            <Card className={`w-[280px] h-[400px] bg-gradient-to-b from-purple-700 to-purple-900 text-white overflow-hidden relative ${className}`}>
                {/* Header */}
                <div className="bg-white/10 p-4 text-center border-b border-white/20">
                    <h2 className="text-lg font-bold">STUDENT ID</h2>
                    <p className="text-xs text-purple-200">Academic Year 2024-2025</p>
                </div>

                {/* Photo Section */}
                <div className="p-6 flex flex-col items-center">
                    <div className="w-32 h-40 bg-white rounded-lg overflow-hidden shadow-lg border-4 border-white mb-4">
                        {getImageUrl(student.id_image) ? (
                            <img 
                                src={getImageUrl(student.id_image)!} 
                                alt={student.full_name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <User className="w-12 h-12 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Student Info */}
                    <div className="text-center w-full">
                        <h1 className="text-lg font-bold mb-2">{student.full_name}</h1>
                        <div className="bg-white/20 rounded-full px-3 py-1 mb-3">
                            <p className="text-sm font-mono">{student.student_number}</p>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                <span>{formatProgram(student.program)}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <Building className="w-4 h-4" />
                                <span className="text-center text-xs">{formatCollege(student.college)}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <Hash className="w-4 h-4" />
                                <span>{student.year_level} Year</span>
                            </div>
                        </div>

                        <div className="mt-4 p-2 bg-white/10 rounded text-xs">
                            <Mail className="w-3 h-3 inline mr-1" />
                            {student.email}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/10 p-3 text-center">
                    <p className="text-xs font-semibold">OFFICIAL STUDENT IDENTIFICATION</p>
                </div>
            </Card>
        );
    }

    if (template === 'compact') {
        return (
            <Card className={`w-[350px] h-[220px] bg-gradient-to-br from-green-600 to-teal-700 text-white overflow-hidden relative ${className}`}>
                {/* Background Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 border border-white rounded-lg rotate-45"></div>
                </div>

                <div className="relative z-10 p-4 h-full">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-20 bg-white rounded overflow-hidden shadow-md border border-white">
                                {getImageUrl(student.id_image) ? (
                                    <img 
                                        src={getImageUrl(student.id_image)!} 
                                        alt={student.full_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <User className="w-6 h-6 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-lg font-bold leading-tight">{student.full_name}</h1>
                                <p className="text-green-100 text-sm font-mono">{student.student_number}</p>
                                <div className="bg-white/20 rounded-full px-2 py-0.5 mt-1 inline-block">
                                    <span className="text-xs">{student.year_level} Year</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <GraduationCap className="w-3 h-3" />
                                <span className="text-xs text-green-200">Program</span>
                            </div>
                            <p className="text-sm font-medium">{formatProgram(student.program)}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <Building className="w-3 h-3" />
                                <span className="text-xs text-green-200">College</span>
                            </div>
                            <p className="text-sm font-medium">{formatCollege(student.college)}</p>
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/15 rounded px-2 py-1 text-xs">
                            <Mail className="w-3 h-3 inline mr-1" />
                            {student.email}
                        </div>
                        <div className="text-right mt-1">
                            <p className="text-xs text-green-200">Digital Student ID</p>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return null;
}