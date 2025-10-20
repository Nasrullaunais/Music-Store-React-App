import { useState, useEffect } from 'react';
import { Card, CardBody, Button, Select, SelectItem, Spinner, Chip } from '@heroui/react';
import { FiDownload, FiFileText, FiTrendingUp, FiDollarSign, FiShoppingCart, FiUsers, FiCalendar } from 'react-icons/fi';
import { adminAPI, MonthlySalesData } from '@/api/adminApi';
import { toast } from 'react-toastify';

const SalesReportManagement = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [salesData, setSalesData] = useState<MonthlySalesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Generate year options (current year and 5 years back)
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);
  
  const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const loadSalesData = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getMonthlySalesData(selectedYear, selectedMonth);
      setSalesData(data);
      toast.success(`Sales data loaded for ${monthOptions[selectedMonth - 1].label} ${selectedYear}`);
    } catch (error: any) {
      console.error('Failed to load sales data:', error);
      toast.error(error.response?.data?.message || 'Failed to load sales data');
      setSalesData(null);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdfReport = async () => {
    setDownloading(true);
    try {
      const blob = await adminAPI.downloadMonthlySalesReport(selectedYear, selectedMonth);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sales_report_${selectedYear}_${selectedMonth.toString().padStart(2, '0')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Sales report downloaded successfully!');
    } catch (error: any) {
      console.error('Failed to download report:', error);
      toast.error(error.response?.data?.message || 'Failed to download sales report');
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    loadSalesData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FiFileText className="text-primary" />
            Monthly Sales Reports
          </h2>
          <p className="text-default-600 mt-1">
            Generate and download comprehensive sales reports
          </p>
        </div>
      </div>

      {/* Controls */}
      <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Year Selection */}
            <Select
              label="Year"
              placeholder="Select year"
              selectedKeys={[selectedYear.toString()]}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              startContent={<FiCalendar className="text-default-400" />}
            >
              {yearOptions.map((year) => (
                <SelectItem key={year.toString()} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </Select>

            {/* Month Selection */}
            <Select
              label="Month"
              placeholder="Select month"
              selectedKeys={[selectedMonth.toString()]}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              startContent={<FiCalendar className="text-default-400" />}
            >
              {monthOptions.map((month) => (
                <SelectItem key={month.value.toString()} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </Select>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                color="primary"
                onPress={loadSalesData}
                isLoading={loading}
                startContent={!loading && <FiTrendingUp />}
                className="flex-1"
              >
                Load Data
              </Button>
              <Button
                color="success"
                onPress={downloadPdfReport}
                isLoading={downloading}
                startContent={!downloading && <FiDownload />}
                className="flex-1"
              >
                Download PDF
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" label="Loading sales data..." />
        </div>
      )}

      {/* Sales Data Display */}
      {!loading && salesData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-success/20 to-success/10 backdrop-blur-md border-success/30 shadow-lg">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-default-600 text-sm">Total Sales</p>
                    <p className="text-2xl font-bold text-success">
                      {formatCurrency(salesData.totalSales)}
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-success/20 rounded-full blur-xl"></div>
                    <FiDollarSign className="text-4xl text-success opacity-80 relative z-10" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-md border-primary/30 shadow-lg">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-default-600 text-sm">Total Orders</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatNumber(salesData.totalOrders)}
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                    <FiShoppingCart className="text-4xl text-primary opacity-80 relative z-10" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-warning/20 to-warning/10 backdrop-blur-md border-warning/30 shadow-lg">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-default-600 text-sm">Unique Customers</p>
                    <p className="text-2xl font-bold text-warning">
                      {formatNumber(salesData.totalCustomers)}
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-warning/20 rounded-full blur-xl"></div>
                    <FiUsers className="text-4xl text-warning opacity-80 relative z-10" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/20 to-secondary/10 backdrop-blur-md border-secondary/30 shadow-lg">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-default-600 text-sm">Avg Order Value</p>
                    <p className="text-2xl font-bold text-secondary">
                      {formatCurrency(salesData.averageOrderValue)}
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-secondary/20 rounded-full blur-xl"></div>
                    <FiTrendingUp className="text-4xl text-secondary opacity-80 relative z-10" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Top Products */}
          <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
            <CardBody className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiTrendingUp className="text-success" />
                Top 10 Best-Selling Products
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-default-200">
                      <th className="text-left py-3 px-4 font-semibold text-default-700">Rank</th>
                      <th className="text-left py-3 px-4 font-semibold text-default-700">Product</th>
                      <th className="text-left py-3 px-4 font-semibold text-default-700">Artist</th>
                      <th className="text-right py-3 px-4 font-semibold text-default-700">Qty Sold</th>
                      <th className="text-right py-3 px-4 font-semibold text-default-700">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.topProducts.length > 0 ? (
                      salesData.topProducts.map((product, index) => (
                        <tr key={index} className="border-b border-default-100 hover:bg-default-100/50 transition-colors">
                          <td className="py-3 px-4">
                            <Chip
                              color={index === 0 ? 'success' : index === 1 ? 'warning' : 'default'}
                              size="sm"
                              variant="flat"
                            >
                              #{index + 1}
                            </Chip>
                          </td>
                          <td className="py-3 px-4 font-medium">{product.productName}</td>
                          <td className="py-3 px-4 text-default-600">{product.artistName}</td>
                          <td className="py-3 px-4 text-right font-semibold">{formatNumber(product.quantitySold)}</td>
                          <td className="py-3 px-4 text-right font-bold text-success">
                            {formatCurrency(product.revenue)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-default-400">
                          No product sales for this period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>

          {/* Daily Sales Breakdown */}
          <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
            <CardBody className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiCalendar className="text-primary" />
                Daily Sales Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 max-h-96 overflow-y-auto">
                {salesData.dailySales.length > 0 ? (
                  salesData.dailySales.map((day) => (
                    <Card key={day.day} className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                      <CardBody className="p-3 text-center">
                        <p className="text-xs text-default-600 mb-1">Day {day.day}</p>
                        <p className="text-lg font-bold text-primary">{formatCurrency(day.sales)}</p>
                        <p className="text-xs text-default-500 mt-1">{formatNumber(day.orders)} orders</p>
                      </CardBody>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-default-400">
                    No daily sales data available
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </>
      )}

      {/* No Data State */}
      {!loading && !salesData && (
        <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
          <CardBody className="p-12">
            <div className="text-center">
              <FiFileText className="text-6xl text-default-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-default-700 mb-2">No Sales Data</h3>
              <p className="text-default-500">
                Select a month and year, then click "Load Data" to view sales information.
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default SalesReportManagement;
