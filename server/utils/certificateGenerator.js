const PDFDocument = require('pdfkit');
const { Readable } = require('stream');

const generateCertificatePDF = async (certData) => {
  return new Promise((resolve, reject) => {
    try {
      // Create landscape A4 size: 842 x 595 points
      const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Colors
      const maroon = '#6B1B3D';
      const gold = '#D4AF37';
      const darkGold = '#B8962C';
      const white = '#FFFFFF';
      const black = '#000000';
      const darkGray = '#333333';

      // 1. Background (White)
      doc.rect(0, 0, 842, 595).fill(white);

      // 2. Thick Gold Border
      doc.rect(30, 30, 782, 535)
         .lineWidth(10)
         .strokeColor(gold)
         .stroke();

      // Thin inner gold border
      doc.rect(45, 45, 752, 505)
         .lineWidth(2)
         .strokeColor(darkGold)
         .stroke();

      // 3. Maroon Wavy Side Panel (Left)
      // Using an SVG path for a smooth bezier curve wave
      doc.save()
         .translate(30, 30) // Offset to match the inside of the thick border roughly
         .path('M 0 0 L 150 0 C 200 150, 50 350, 180 535 L 0 535 Z')
         .fill(maroon)
         .restore();

      // Add some gold dotted styling over the wave (mocked with small circles)
      doc.fillColor(gold);
      for(let i = 0; i < 40; i++) {
         const y = 80 + (i * 12);
         // calculate x based on a sine wave pattern
         const xOffset = Math.sin(i * 0.2) * 20;
         doc.circle(120 + xOffset, y, 1.5).fill();
         doc.circle(130 + xOffset, y + 5, 1).fill();
      }

      // 4. Header Texts
      // We will use Times-Bold for an elegant Serif look
      doc.fillColor(black)
         .font('Times-Bold')
         .fontSize(42)
         .text('CERTIFICATE', 250, 100, { align: 'center', characterSpacing: 4 });

      doc.font('Times-Roman')
         .fontSize(16)
         .text('OF ACHIEVEMENT', 250, 145, { align: 'center', characterSpacing: 2 });

      doc.moveDown(3);

      doc.font('Helvetica')
         .fontSize(12)
         .fillColor(darkGray)
         .text('THIS CERTIFICATE IS PROUDLY PRESENTED TO', 250, 220, { align: 'center', characterSpacing: 1 });

      // 5. Student Name (Cursive-like if possible, using Times-Italic as fallback and larger size)
      doc.moveDown(1);
      doc.font('Times-Italic')
         .fontSize(48)
         .fillColor(black)
         .text(certData.studentName, 250, 260, { align: 'center' });

      // Name underline
      doc.moveTo(350, 315)
         .lineTo(750, 315)
         .lineWidth(1)
         .strokeColor(gold)
         .stroke();

      // 6. Event Description
      doc.moveDown(2);
      doc.font('Times-Italic')
         .fontSize(14)
         .fillColor(darkGray)
         .text(`For successfully attending and participating in`, 250, 340, { align: 'center' });
      
      doc.font('Times-Bold')
         .fontSize(18)
         .fillColor(maroon)
         .text(certData.eventName, 250, 365, { align: 'center' });

      // 7. Signature and Date Lines
      // Signature Left
      doc.moveTo(300, 480)
         .lineTo(450, 480)
         .lineWidth(1)
         .strokeColor(darkGray)
         .stroke();
      doc.font('Helvetica-Bold')
         .fontSize(10)
         .fillColor(black)
         .text('SIGNATURE', 300, 490, { width: 150, align: 'center' });

      // Date Right
      doc.moveTo(600, 480)
         .lineTo(750, 480)
         .lineWidth(1)
         .strokeColor(darkGray)
         .stroke();
      doc.text('DATE', 600, 490, { width: 150, align: 'center' });
      
      // Actually write the date above the line
      doc.font('Times-Italic')
         .fontSize(14)
         .fillColor(black)
         .text(certData.date, 600, 460, { width: 150, align: 'center' });

      // 8. Gold Badge / Seal (Right Side)
      const badgeX = 680;
      const badgeY = 200;
      
      // Badge Ribbons
      doc.polygon([badgeX - 10, badgeY + 20], [badgeX - 30, badgeY + 80], [badgeX - 15, badgeY + 70], [badgeX, badgeY + 85])
         .fill(darkGold);
      doc.polygon([badgeX + 10, badgeY + 20], [badgeX + 30, badgeY + 80], [badgeX + 15, badgeY + 70], [badgeX, badgeY + 85])
         .fill(darkGold);

      // Badge Circle
      doc.circle(badgeX, badgeY, 35)
         .lineWidth(4)
         .strokeColor(darkGold)
         .fillAndStroke(gold, darkGold);
      
      // Inner Badge Circle
      doc.circle(badgeX, badgeY, 28)
         .fill(maroon);
         
      doc.font('Times-Bold')
         .fontSize(10)
         .fillColor(white)
         .text('2026', badgeX - 15, badgeY - 10, { width: 30, align: 'center' });
      doc.fontSize(8)
         .text('AWARD', badgeX - 20, badgeY + 2, { width: 40, align: 'center' });

      // Star below Award
      doc.circle(badgeX, badgeY + 15, 2).fill(white);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateCertificatePDF };
