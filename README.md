# 🌸 Miyuki Pagination

[![npm version](https://img.shields.io/npm/v/miyuki-pagination.svg?style=flat-square)](https://www.npmjs.com/package/miyuki-pagination)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14+-7289da?style=flat-square)](https://discord.js.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> A delightfully cute and professional Discord embed paginator for Discord.js v14+ ✨

Transform your bot's embed displays into beautiful, interactive experiences with customizable buttons, adorable messages, and powerful features that users will love!

## ✨ Features

- 🎨 **Fully Customizable** - Buttons, messages, styling, and behavior
- 🌸 **Cute Default Messages** - Adorable responses that add personality
- 🚀 **TypeScript Ready** - Full type safety and IntelliSense support
- 🔧 **Easy to Use** - Simple API with sensible defaults
- 🎯 **Multiple Navigation Modes** - From minimal to advanced layouts
- ⚡ **Performance Optimized** - Efficient collectors and memory management
- 🔒 **Permission Control** - Author-only or public interaction modes
- 🔄 **Loop Navigation** - Optional page wrapping for seamless browsing
- 📊 **Page Information** - Built-in page info and jump functionality
- 🎨 **Pre-made Themes** - Beautiful button configs ready to use

## 📦 Installation

```bash
npm install miyuki-pagination
# or
yarn add miyuki-pagination
# or
pnpm add miyuki-pagination
# or
bun add miyuki-pagination
```

## 🚀 Quick Start

```typescript
import { EmbedBuilder } from 'discord.js';
import { MiyukiPaginator } from 'miyuki-pagination';

// Create your embeds
const embeds = [
  new EmbedBuilder().setTitle('Page 1').setDescription('First page content! (◕‿◕)'),
  new EmbedBuilder().setTitle('Page 2').setDescription('Second page content! ✨'),
  new EmbedBuilder().setTitle('Page 3').setDescription('Third page content! 🌸'),
];

// Create and start the paginator
const paginator = new MiyukiPaginator({ embeds });
await paginator.start(interaction);
```

That's it! Your users can now navigate through pages with beautiful, responsive buttons! 🎉

## 📖 Basic Usage

### Slash Commands

```typescript
import { SlashCommandBuilder } from 'discord.js';
import { MiyukiPaginator } from 'miyuki-pagination';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show help pages'),
  
  async execute(interaction) {
    const helpEmbeds = createHelpEmbeds(); // Your embed creation logic
    
    const paginator = new MiyukiPaginator({
      embeds: helpEmbeds,
      timeout: 60000,
      showPageNumbers: true,
      authorOnly: true
    });
    
    await paginator.start(interaction);
  }
};
```

### Regular Messages

```typescript
// For prefix commands or message-based triggers
const paginator = new MiyukiPaginator({ embeds: myEmbeds });
await paginator.startMessage(message, { content: 'Here are your results!' });
```

## 🎨 Customization Options

### Button Themes

Use pre-made button configurations for different styles:

```typescript
import { ButtonConfigs, createMiyukiPaginator } from 'miyuki-pagination';

// Minimal navigation (Previous, Stop, Next)
const minimal = createMiyukiPaginator({
  embeds: myEmbeds,
  buttons: ButtonConfigs.minimal()
});

// Simple navigation (Previous, Next only)
const simple = createMiyukiPaginator({
  embeds: myEmbeds,
  buttons: ButtonConfigs.simple()
});

// Advanced navigation (all features)
const advanced = createMiyukiPaginator({
  embeds: myEmbeds,
  buttons: ButtonConfigs.advanced()
});

// Cute theme with flower emojis! 🌸
const cute = createMiyukiPaginator({
  embeds: myEmbeds,
  buttons: ButtonConfigs.cute()
});
```

### Custom Buttons

Create your own button layouts:

```typescript
import { PaginatorButtonType, ButtonStyle } from 'miyuki-pagination';

const paginator = new MiyukiPaginator({
  embeds: myEmbeds,
  buttons: [
    {
      type: PaginatorButtonType.PREVIOUS,
      emoji: '⬅️',
      label: 'Back',
      style: ButtonStyle.Primary,
      position: 0
    },
    {
      type: PaginatorButtonType.STOP,
      emoji: '🛑',
      label: 'Stop',
      style: ButtonStyle.Danger,
      position: 1
    },
    {
      type: PaginatorButtonType.NEXT,
      emoji: '➡️',
      label: 'Forward',
      style: ButtonStyle.Primary,
      position: 2
    }
  ]
});
```

### Custom Messages

Personalize all the messages or add internationalization:

```typescript
const paginator = new MiyukiPaginator({
  embeds: myEmbeds,
  responseMessages: {
    authorOnlyError: "🚫 Only you can navigate this menu!",
    noEmbedsError: "😅 Oops! No content to display.",
    pageInfoTitle: "📋 Navigation Info",
    pageInfoDescription: "Current pagination details:",
    jumpToPageContent: "🎯 Jump to page {current} of {total}"
  }
});
```

## 🔧 Advanced Features

### Page Looping

Enable seamless navigation with page wrapping:

```typescript
const paginator = new MiyukiPaginator({
  embeds: myEmbeds,
  loopPages: true, // Last page -> First page, First page -> Last page
  showPageNumbers: true
});
```

### Public Interaction Mode

Allow anyone to navigate (not just the command author):

```typescript
const paginator = new MiyukiPaginator({
  embeds: myEmbeds,
  authorOnly: false, // Anyone can interact with buttons
  timeout: 120000   // Longer timeout for public use
});
```

### Page Information & Jumping

Add utility buttons for better navigation:

```typescript
const paginator = new MiyukiPaginator({
  embeds: myEmbeds,
  allowJumping: true,  // Adds jump-to-page button
  showPageInfo: true,  // Adds page info button
  showPageNumbers: true // Shows "Page X of Y" in footer
});
```

### Dynamic Message Updates

Update messages after creating the paginator:

```typescript
const paginator = new MiyukiPaginator({ embeds: myEmbeds });

// Update a single message
paginator.updateResponseMessage('authorOnlyError', 'Custom error message!');

// Update multiple messages
paginator.updateMultipleMessages({
  pageInfoTitle: 'Custom Info Title',
  pageInfoDescription: 'Custom description here!'
});
```

## 🛠️ Utility Functions

### Easy Embed Creation

Convert data objects to embeds effortlessly:

```typescript
import { createEmbedsFromContent } from 'miyuki-pagination';

const content = [
  {
    title: 'Server Rules',
    description: 'Please follow these guidelines:',
    color: 0xff69b4,
    fields: [
      { name: '1. Be Respectful', value: 'Treat everyone kindly', inline: false },
      { name: '2. No Spam', value: 'Keep chat clean', inline: false }
    ],
    thumbnail: 'https://example.com/rules-icon.png'
  },
  {
    title: 'Moderation',
    description: 'Information about our moderation system:',
    color: 0x00ff00,
    fields: [
      { name: 'Warning System', value: '3 strikes policy', inline: true },
      { name: 'Appeal Process', value: 'DM moderators', inline: true }
    ]
  }
];

const embeds = createEmbedsFromContent(content);
const paginator = new MiyukiPaginator({ embeds });
```

### Factory Function

Use the factory function for cleaner code:

```typescript
import { createMiyukiPaginator } from 'miyuki-pagination';

const paginator = createMiyukiPaginator({
  embeds: myEmbeds,
  timeout: 30000,
  authorOnly: false,
  loopPages: true
});
```

## 📚 API Reference

### MiyukiPaginator Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `embeds` | `EmbedBuilder[]` | **Required** | Array of embeds to paginate |
| `timeout` | `number` | `60000` | Timeout in milliseconds |
| `buttons` | `CustomButton[]` | `undefined` | Custom button configuration |
| `useDefaultButtons` | `boolean` | `true` | Whether to use default buttons |
| `buttonLabels` | `object` | `{}` | Custom labels for default buttons |
| `buttonEmojis` | `object` | `{}` | Custom emojis for default buttons |
| `responseMessages` | `ResponseMessages` | `{}` | Custom response messages |
| `showPageNumbers` | `boolean` | `true` | Show "Page X of Y" in footer |
| `authorOnly` | `boolean` | `true` | Only author can interact |
| `maxButtonsPerRow` | `number` | `5` | Max buttons per row |
| `allowJumping` | `boolean` | `false` | Enable jump-to-page feature |
| `showPageInfo` | `boolean` | `false` | Show page info button |
| `loopPages` | `boolean` | `false` | Enable page looping |

### Button Types

```typescript
enum PaginatorButtonType {
  FIRST = "first",     // Navigate to first page
  PREVIOUS = "previous", // Navigate to previous page
  NEXT = "next",       // Navigate to next page
  LAST = "last",       // Navigate to last page
  STOP = "stop",       // Close paginator
  JUMP = "jump",       // Jump to specific page
  INFO = "info"        // Show page information
}
```

### Methods

- `start(interaction: CommandInteraction)` - Start from slash command
- `startMessage(message: Message, options?)` - Start from regular message
- `updateResponseMessage(key, value)` - Update single message
- `updateMultipleMessages(messages)` - Update multiple messages
- `getResponseMessage(key)` - Get current message
- `getAllResponseMessages()` - Get all current messages

## 🎯 Examples

### Help Command with Categories

```typescript
const helpCategories = [
  {
    title: '📋 General Commands',
    description: 'Basic bot functionality',
    fields: [
      { name: '/help', value: 'Show this help menu', inline: false },
      { name: '/ping', value: 'Check bot latency', inline: false }
    ],
    color: 0x3498db
  },
  {
    title: '🎵 Music Commands',
    description: 'Music playback features',
    fields: [
      { name: '/play', value: 'Play a song', inline: false },
      { name: '/pause', value: 'Pause current song', inline: false }
    ],
    color: 0xe91e63
  }
];

const embeds = createEmbedsFromContent(helpCategories);
const paginator = new MiyukiPaginator({
  embeds,
  buttons: ButtonConfigs.cute(),
  timeout: 120000
});

await paginator.start(interaction);
```

### Server Member List

```typescript
async function createMemberPages(guild) {
  const members = await guild.members.fetch();
  const pages = [];
  const membersPerPage = 10;
  
  for (let i = 0; i < members.size; i += membersPerPage) {
    const pageMembers = Array.from(members.values()).slice(i, i + membersPerPage);
    
    const embed = new EmbedBuilder()
      .setTitle(`👥 Server Members`)
      .setDescription(`Showing ${pageMembers.length} members`)
      .setColor(0x00ff00);
    
    pageMembers.forEach(member => {
      embed.addFields({
        name: member.displayName,
        value: `<@${member.id}>`,
        inline: true
      });
    });
    
    pages.push(embed);
  }
  
  return pages;
}

// Usage
const memberEmbeds = await createMemberPages(interaction.guild);
const paginator = new MiyukiPaginator({
  embeds: memberEmbeds,
  authorOnly: false,
  showPageInfo: true,
  allowJumping: true
});

await paginator.start(interaction);
```

## 🤝 Contributing

We love contributions! Whether it's bug reports, feature requests, or code improvements:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌸 Credits

Made with ❤️ and lots of kawaii energy! Special thanks to the Discord.js team for the amazing library.

---

**Miyuki Pagination** - Making Discord bot pagination cute and powerful since 2025! ✨

*If you love this library, consider giving it a ⭐ on GitHub!*