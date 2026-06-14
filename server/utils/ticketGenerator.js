const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const { Readable } = require('stream');
// const cloudinary = require('cloudinary').v2; // Assuming Cloudinary is configured elsewhere and passed here or we handle it in controller

const generateTicketPDF = async (ticketData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Create landscape A4 or smaller ticket size
      // Standard ticket size: ~ 8.5 x 3.5 inches. 1 inch = 72 points -> 612 x 252
      const doc = new PDFDocument({ size: [612, 252], margin: 0 });
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Backgrounds
      // Left side (Dark charcoal)
      doc.rect(0, 0, 428, 252).fill('#1a1a1a');
      // Right side (White)
      doc.rect(428, 0, 184, 252).fill('#ffffff');

      // Perforation line (dashed)
      doc.lineWidth(2).strokeColor('#d4af37').dash(5, { space: 5 });
      doc.moveTo(428, 0).lineTo(428, 252).stroke();
      doc.undash();

      // LEFT SIDE CONTENT (Dark)
      doc.fillColor('#d4af37').fontSize(10).text('ADMIT ONE', 40, 40, { characterSpacing: 2 });
      doc.fillColor('#ffffff').fontSize(36).font('Helvetica-Bold').text(ticketData.eventName.toUpperCase().substring(0, 15), 40, 60);
      doc.fillColor('#cccccc').fontSize(16).font('Helvetica-Bold').text('EVENT TICKET', 40, 105, { characterSpacing: 4 });

      // Event details
      doc.fontSize(10).fillColor('#888888').text('DATE', 40, 150);
      doc.fillColor('#ffffff').fontSize(14).text(ticketData.date, 40, 165);

      doc.fontSize(10).fillColor('#888888').text('TIME', 150, 150);
      doc.fillColor('#ffffff').fontSize(14).text(ticketData.time || 'TBA', 150, 165); 

      doc.fontSize(10).fillColor('#888888').text('VENUE', 40, 195);
      doc.fillColor('#ffffff').fontSize(12).text(ticketData.venue || 'TBA', 40, 210, { width: 350 });

      // Barcode on the left (simulated with random lines)
      doc.lineWidth(1).strokeColor('#ffffff');
      for (let i = 0; i < 40; i++) {
        const x = 300 + (i * 3);
        const height = Math.random() > 0.5 ? 30 : 20;
        if (Math.random() > 0.2) {
          doc.moveTo(x, 40).lineTo(x, 40 + height).stroke();
        }
      }

      // RIGHT SIDE CONTENT (Light stub)
      doc.fillColor('#888888').fontSize(8).font('Helvetica').text('EVENT', 448, 30, { characterSpacing: 1 });
      doc.fillColor('#d4af37').fontSize(18).font('Helvetica-Bold').text('TICKET', 448, 42);

      doc.fillColor('#888888').fontSize(8).text('TYPE', 448, 80);
      doc.fillColor('#000000').fontSize(12).font('Helvetica-Bold').text('GENERAL', 448, 92);

      doc.fillColor('#888888').fontSize(8).font('Helvetica').text('DATE', 520, 80);
      doc.fillColor('#000000').fontSize(12).font('Helvetica-Bold').text(ticketData.date.substring(0, 5), 520, 92);

      doc.fillColor('#888888').fontSize(8).font('Helvetica').text('TIME', 448, 120);
      doc.fillColor('#000000').fontSize(12).font('Helvetica-Bold').text(ticketData.time || 'TBA', 448, 132);

      doc.fillColor('#888888').fontSize(8).font('Helvetica').text('STATUS', 520, 120);
      doc.fillColor('#000000').fontSize(12).font('Helvetica-Bold').text('ACTIVE', 520, 132);

      // QR Code on right stub
      const qrImage = await QRCode.toDataURL(ticketData.ticketId, { margin: 0 });
      const base64Data = qrImage.replace(/^data:image\/png;base64,/, "");
      const qrBuffer = Buffer.from(base64Data, 'base64');
      
      doc.image(qrBuffer, 448, 170, { width: 60, height: 60 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateTicketPDF };
