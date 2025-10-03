import nodemailer from "nodemailer";

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { name, email, phone, subject, message } = req.body ?? {};

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "Missing fields" });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER;
        const adminTo = process.env.TO_EMAIL || fromEmail;

        await transporter.sendMail({
            from: `"Website Contact" <${fromEmail}>`,
            to: adminTo,
            subject: `[Liên hệ] ${subject} — ${name}`,
            html: `
                <h2>Liên hệ mới</h2>
                <p><strong>Tên:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Điện thoại:</strong> ${phone || "—"}</p>
                <p><strong>Tiêu đề:</strong> ${subject}</p>
                <p><strong>Nội dung:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
            `,
            replyTo: email,
        });

        await transporter.sendMail({
            from: `"Hỗ trợ Website" <${fromEmail}>`,
            to: email,
            subject: `Cảm ơn ${name}, chúng tôi đã nhận được tin nhắn của bạn`,
            html: `
                <p>Xin chào ${name},</p>
                <p>Cảm ơn bạn đã liên hệ. Chúng tôi đã nhận được tin nhắn:</p>
                <blockquote>${message.replace(/\n/g, "<br/>")}</blockquote>
                <p>Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
                <p>Thân,<br/>Đội ngũ hỗ trợ</p>
            `,
        });

        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error("send-email error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
