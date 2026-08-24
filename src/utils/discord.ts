// Utility to dispatch Discord Webhook notifications with rich embeds

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface SendDiscordWebhookParams {
  webhookUrl?: string;
  title: string;
  description?: string;
  color?: number; // Hex color number (e.g. 0xef4444 for red, 0x10b981 for green, 0x3b82f6 for blue, 0xf59e0b for amber)
  fields?: DiscordEmbedField[];
  imageUrl?: string;
  authorName?: string;
  footerText?: string;
}

export const sendDiscordWebhook = async ({
  webhookUrl,
  title,
  description,
  color = 0x3b82f6,
  fields = [],
  imageUrl,
  authorName = 'Carlos69 System Bot',
  footerText = 'Carlos69 Automated Notification',
}: SendDiscordWebhookParams): Promise<{ success: boolean; message: string }> => {
  if (!webhookUrl || !webhookUrl.trim().startsWith('http')) {
    console.warn('[Discord Webhook] Webhook URL belum diatur atau tidak valid:', webhookUrl);
    return { success: false, message: 'URL Webhook Discord belum diatur di pengaturan admin.' };
  }

  const timestamp = new Date().toISOString();

  const embed: any = {
    title,
    description: description || '',
    color,
    timestamp,
    author: {
      name: authorName,
      icon_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=carlos69',
    },
    fields: fields.filter((f) => f.name && f.value),
    footer: {
      text: `${footerText} • Carlos69 Platform`,
    },
  };

  if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
    embed.image = { url: imageUrl };
  }

  const payload = {
    username: 'Carlos69 Bot',
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=carlos69',
    embeds: [embed],
  };

  try {
    const response = await fetch(webhookUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 204) {
      return { success: true, message: 'Notifikasi berhasil dikirim ke Discord!' };
    } else {
      const errText = await response.text().catch(() => '');
      console.error('[Discord Webhook] Gagal mengirim webhook:', response.status, errText);
      return { success: false, message: `Discord Webhook merespons status ${response.status}` };
    }
  } catch (error: any) {
    console.error('[Discord Webhook] Error saat mengirim fetch webhook:', error);
    return { success: false, message: error.message || 'Gagal menghubungi server Discord.' };
  }
};
