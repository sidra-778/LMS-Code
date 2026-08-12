import React, { useState, useEffect, useMemo } from "react";
import { fetchApi } from "../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  Download,
  AlertCircle,
  FileText,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const EMPTY_FILTERS = { search: "", course: "all", region: "all" };

export default function AdminReports() {
  // Missing assessments table
  const [missingAssessments, setMissingAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Course completion rates chart
  const [completionRates, setCompletionRates] = useState([]);
  const [completionLoading, setCompletionLoading] = useState(true);
  const [completionError, setCompletionError] = useState(null);

  // Regional performance chart
  const [regionalPerformance, setRegionalPerformance] = useState([]);
  const [regionalLoading, setRegionalLoading] = useState(true);
  const [regionalError, setRegionalError] = useState(null);

  // Table filters
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchApi("/api/admin/reports/missing-assessments");
        setMissingAssessments(Array.isArray(data) ? data : data.missingAssessments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  useEffect(() => {
    const loadCompletionRates = async () => {
      try {
        const data = await fetchApi("/api/admin/reports/completion-rates");
        setCompletionRates(Array.isArray(data) ? data : data.completionRates || []);
      } catch (err) {
        setCompletionError(err.message);
      } finally {
        setCompletionLoading(false);
      }
    };
    loadCompletionRates();
  }, []);

  useEffect(() => {
    const loadRegionalPerformance = async () => {
      try {
        const data = await fetchApi("/api/admin/reports/regional-performance");
        setRegionalPerformance(Array.isArray(data) ? data : data.regionalPerformance || []);
      } catch (err) {
        setRegionalError(err.message);
      } finally {
        setRegionalLoading(false);
      }
    };
    loadRegionalPerformance();
  }, []);

  // Build filter dropdown options from whatever the table actually returned
  const courseOptions = useMemo(() => {
    const titles = new Set();
    missingAssessments.forEach((r) => {
      if (r.course?.title) titles.add(r.course.title);
    });
    return Array.from(titles).sort();
  }, [missingAssessments]);

  const regionOptions = useMemo(() => {
    const regions = new Set();
    missingAssessments.forEach((r) => {
      const region = r.user?.region || r.region;
      if (region) regions.add(region);
    });
    return Array.from(regions).sort();
  }, [missingAssessments]);

  const filteredAssessments = useMemo(() => {
    return missingAssessments.filter((record) => {
      const name = record.user?.name || "";
      const erpId = record.user?.erpId || "";
      const courseTitle = record.course?.title || "";
      const region = record.user?.region || record.region || "";

      if (filters.search) {
        const q = filters.search.trim().toLowerCase();
        const haystack = `${name} ${erpId}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filters.course !== "all" && courseTitle !== filters.course) return false;
      if (filters.region !== "all" && region !== filters.region) return false;
      return true;
    });
  }, [missingAssessments, filters]);

  const hasActiveFilters =
    filters.search !== "" || filters.course !== "all" || filters.region !== "all";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Reports</h1>
          <p className="text-gray-500">Generate and view system reports.</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export All Reports
        </Button>
      </div>

      {/* ---- Data visualization ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Course Completion Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completionLoading && (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                Loading chart...
              </div>
            )}
            {!completionLoading && completionError && (
              <div className="h-48 flex flex-col items-center justify-center gap-2 text-gray-400 text-sm border border-dashed rounded-lg">
                <AlertCircle className="h-5 w-5" />
                Could not load completion rates
              </div>
            )}
            {!completionLoading && !completionError && completionRates.length === 0 && (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm border border-dashed rounded-lg">
                No completion data available
              </div>
            )}
            {!completionLoading && !completionError && completionRates.length > 0 && (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={completionRates} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f1f3" />
                    <XAxis
                      dataKey="course"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} unit="%" domain={[0, 100]} />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Completion rate"]}
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    />
                    <Bar dataKey="rate" radius={[4, 4, 0, 0]} fill="#4f46e5" maxBarSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Regional Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {regionalLoading && (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                Loading chart...
              </div>
            )}
            {!regionalLoading && regionalError && (
              <div className="h-48 flex flex-col items-center justify-center gap-2 text-gray-400 text-sm border border-dashed rounded-lg">
                <AlertCircle className="h-5 w-5" />
                Could not load regional performance
              </div>
            )}
            {!regionalLoading && !regionalError && regionalPerformance.length === 0 && (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm border border-dashed rounded-lg">
                No regional data available
              </div>
            )}
            {!regionalLoading && !regionalError && regionalPerformance.length > 0 && (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalPerformance} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f1f3" />
                    <XAxis dataKey="region" tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} unit="%" domain={[0, 100]} />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Avg. score"]}
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    />
                    <Bar dataKey="rate" radius={[4, 4, 0, 0]} fill="#0891b2" maxBarSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ---- Missing assessments + filters ---- */}
      <Card className="border-amber-200 shadow-sm bg-white">
        <CardHeader className="bg-amber-50/50 border-b border-amber-100 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="h-5 w-5" />
            Missing Assessments Report
          </CardTitle>
          <p className="text-sm text-amber-700 mt-1">
            Employees who have completed the course modules but have not yet taken the final assessment.
          </p>
        </CardHeader>

        <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </div>

          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder="Search by name or ERP ID"
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 w-56"
            />
          </div>

          <select
            value={filters.course}
            onChange={(e) => setFilters((f) => ({ ...f, course: e.target.value }))}
            className="text-sm border border-gray-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Courses</option>
            {courseOptions.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>

          {regionOptions.length > 0 && (
            <select
              value={filters.region}
              onChange={(e) => setFilters((f) => ({ ...f, region: e.target.value }))}
              className="text-sm border border-gray-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Regions</option>
              {regionOptions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          )}

          {hasActiveFilters && (
            <button
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}

          <span className="ml-auto text-xs text-gray-400">
            {filteredAssessments.length} of {missingAssessments.length} records
          </span>
        </div>

        <CardContent className="p-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed On</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    Loading reports...
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-red-500">
                    Failed to load reports: {error}
                  </td>
                </tr>
              )}
              {!loading && !error && missingAssessments.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No missing assessments found!
                  </td>
                </tr>
              )}
              {!loading && !error && missingAssessments.length > 0 && filteredAssessments.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No records match the selected filters.
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                filteredAssessments.map((record, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.user?.name || "Unknown"}</div>
                      <div className="text-sm text-gray-500">ERP: {record.user?.erpId || "Unknown"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.course?.title || "Unknown Course"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">-</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="outline" size="sm">Remind User</Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
