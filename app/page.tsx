'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('파일을 선택해주세요');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/review', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Processing failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '처리 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = () => {
    if (!result) return;
    
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutrition-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-bio-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bio-gradient rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-bio-900">Root Inside BioNutrition AI</h1>
                <p className="text-sm text-earth-600">영양 성분표 AI 분석 시스템</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-bio-900 mb-4">
            영양 성분표를 업로드하고<br />AI 분석 결과를 확인하세요
          </h2>
          <p className="text-lg text-earth-700 max-w-2xl mx-auto">
            Azure OCR과 OpenAI를 활용한 전문적인 영양 성분 분석 및 검증 시스템
          </p>
        </div>

        {/* Upload Section */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-bio-100 overflow-hidden animate-fade-in">
            <form onSubmit={handleSubmit} className="p-8">
              {/* File Upload Area */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-bio-900 mb-3">
                  영양 성분표 파일 업로드
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-earth-700
                      file:mr-4 file:py-3 file:px-6
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-bio-50 file:text-bio-700
                      hover:file:bg-bio-100
                      cursor-pointer border-2 border-dashed border-bio-300
                      rounded-lg p-4 hover:border-bio-500 transition-all"
                  />
                </div>
                {file && (
                  <p className="mt-2 text-sm text-bio-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {file.name}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!file || loading}
                className="w-full bio-gradient text-white py-4 px-6 rounded-lg font-semibold
                  hover:shadow-lg transform hover:-translate-y-0.5 transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>분석 중...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>AI 분석 시작</span>
                  </>
                )}
              </button>
            </form>

            {/* Error Display */}
            {error && (
              <div className="px-8 pb-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-semibold text-red-800">오류가 발생했습니다</h4>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                    <p className="text-xs text-red-600 mt-2">
                      .env.local 파일에 Azure와 OpenAI API 키가 올바르게 설정되어 있는지 확인해주세요.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="max-w-5xl mx-auto mt-8 animate-fade-in">
            {/* AI Summary Card */}
            {result.ai_summary && (
              <div className="bg-white rounded-2xl shadow-xl border border-bio-100 p-8 mb-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bio-gradient rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-bio-900">AI 분석 결과</h3>
                    <p className="text-sm text-earth-600">OpenAI GPT-4 분석</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-bio-50 rounded-xl p-6 border border-bio-200">
                    <p className="text-lg text-bio-900 leading-relaxed">{result.ai_summary.summary}</p>
                  </div>

                  {result.ai_summary.highlights?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-bio-800 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        영양 장점
                      </h4>
                      <ul className="space-y-2">
                        {result.ai_summary.highlights.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start space-x-2 text-bio-700">
                            <span className="text-bio-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.ai_summary.cautions?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-amber-800 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        주의사항
                      </h4>
                      <ul className="space-y-2">
                        {result.ai_summary.cautions.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start space-x-2 text-amber-700">
                            <span className="text-amber-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Nutrition Data Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-bio-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 earth-gradient rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-earth-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-bio-900">영양 성분 정보</h3>
                    <p className="text-sm text-earth-600">검증된 데이터</p>
                  </div>
                </div>
                <button
                  onClick={downloadJSON}
                  className="bg-earth-100 hover:bg-earth-200 text-earth-800 px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>JSON 다운로드</span>
                </button>
              </div>

              {/* Serving Size */}
              {result.serving_size && (
                <div className="mb-6 bg-earth-50 rounded-xl p-4 border border-earth-200">
                  <h4 className="text-sm font-semibold text-earth-800 mb-2">1회 제공량</h4>
                  <p className="text-2xl font-bold text-bio-700">
                    {result.serving_size.value}{result.serving_size.unit}
                  </p>
                </div>
              )}

              {/* Nutrients Grid */}
              {result.nutrients && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(result.nutrients).map(([key, data]: [string, any]) => (
                    <div key={key} className="border border-earth-200 rounded-lg p-4 hover:border-bio-300 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="text-sm font-medium text-earth-700 capitalize">
                            {key.replace(/_/g, ' ')}
                          </h5>
                          <p className="text-xl font-bold text-bio-900 mt-1">
                            {data.value}{data.unit}
                          </p>
                        </div>
                        {result.dv && result.dv[key] && (
                          <div className="text-right">
                            <div className="text-xs text-earth-600">% DV</div>
                            <div className="text-lg font-bold text-bio-600">{result.dv[key]}%</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-bio-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-earth-600">
            <p className="mb-2">
              <strong className="text-bio-700">Root Inside Co., Ltd.</strong> - BioNutrition AI System
            </p>
            <p className="text-xs">
              이 시스템은 참고용으로 제공됩니다. 최종 검증은 제조사의 책임입니다.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
