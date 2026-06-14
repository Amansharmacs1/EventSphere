import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import toast from 'react-hot-toast';
import { QrCode, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Initialize Scanner
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(onScanSuccess, onScanFailure);

    function onScanSuccess(decodedText) {
      // Avoid multiple scans of the same ticket consecutively
      setScanResult((prev) => {
        if (prev === decodedText) return prev;
        verifyTicket(decodedText);
        return decodedText;
      });
    }

    function onScanFailure(error) {
      // Ignore routine scan failures (when no QR is in frame)
    }

    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);

  const verifyTicket = async (ticketId) => {
    setIsVerifying(true);
    try {
      const response = await axios.post(
        '/api/tickets/scan',
        { ticketId },
        { withCredentials: true }
      );
      toast.success(response.data.message || 'Check-in successful!');
    } catch (error) {
      const msg = error.response?.data?.message || 'Verification failed';
      toast.error(msg);
    } finally {
      setIsVerifying(false);
      
      // Reset scan result after 3 seconds to allow scanning again
      setTimeout(() => {
        setScanResult(null);
      }, 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full mb-4">
          <QrCode size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">QR Code Scanner</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Scan student tickets at the entrance to verify and check them in.</p>
      </div>

      <div className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-border-dark flex flex-col items-center">
        {/* Scanner Container */}
        <div 
          id="qr-reader" 
          className="w-full max-w-md overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 dark:border-border-dark"
        ></div>

        {/* Status Indicator */}
        <div className="mt-8 h-16 flex items-center justify-center">
          {isVerifying ? (
            <div className="flex items-center space-x-2 text-primary-600">
              <Loader2 className="animate-spin" size={24} />
              <span className="font-semibold">Verifying Ticket...</span>
            </div>
          ) : scanResult ? (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <CheckCircle className="text-emerald-500" size={24} />
              <span>Ready for next scan in a moment...</span>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Position the QR code within the frame to scan.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
