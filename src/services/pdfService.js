const PDFDocument = require("pdfkit");

exports.generateArticlePDF = (res, article) => {
    try {
        const doc = new PDFDocument({ 
            margin: 50,
            size: 'A4',
            bufferPages: true
        });

        doc.on('error', (err) => {
            console.error('PDF Generation Error:', err);
            if (!res.headersSent) {
                res.status(500).send('Error generating PDF');
            }
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=article-${article.articleId}-v${article.versionNumber || '1'}.pdf`
        );

        doc.pipe(res);

    doc.fontSize(24)
       .font('Helvetica-Bold')
       .text(article.title, {
           align: "center"
       });
    
    doc.moveDown(0.5);

    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#666666');
    
    doc.moveTo(50, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .stroke('#cccccc');
    
    doc.moveDown(0.5);

    const metadata = [];
    
    if (article.author) {
        metadata.push(`Author: ${article.author}`);
    }
    
    if (article.createdAt) {
        const dateStr = new Date(article.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        metadata.push(`Created: ${dateStr}`);
    }
    
    if (article.versionNumber) {
        metadata.push(`Version: ${article.versionNumber}`);
    }
    
    if (article.workspace) {
        metadata.push(`Workspace: ${article.workspace}`);
    }

    if (metadata.length > 0) {
        doc.text(metadata.join('  •  '), {
            align: 'center'
        });
    }

    doc.moveDown(0.5);

    doc.moveTo(50, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .stroke('#cccccc');
    
    doc.moveDown(1.5);

    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#000000')
       .text(article.body, {
           align: 'left',
           lineGap: 3
       });

    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        
        doc.fontSize(9)
           .fillColor('#666666')
           .text(
               `Page ${i + 1} of ${pages.count}`,
               50,
               doc.page.height - 50,
               {
                   align: 'center'
               }
           );
    }

    doc.end();
    } catch (err) {
        console.error('PDF Generation Error:', err);
        if (!res.headersSent) {
            res.status(500).send('Error generating PDF');
        }
    }
};
