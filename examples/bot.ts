import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonStyle,
  CommandInteraction,
  Message,
  REST,
  Routes,
  ActivityType,
  type ColorResolvable
} from 'discord.js';
import {
  MiyukiPaginator,
  createMiyukiPaginator,
  ButtonConfigs,
  createEmbedsFromContent,
  PaginatorButtonType,
  type PaginatedContent,
  type CustomButton
} from '../src';

// 🌸 Bot Configuration
const TOKEN = process.env.BOT_TOKEN as string; // Replace with your bot token
const CLIENT_ID = process.env.CLIENT_ID as string; // Replace with your application ID

// 🎨 Create the Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// 📚 Sample data for demonstrations
const helpData: PaginatedContent[] = [
  {
    title: '🌸 Welcome to Miyuki Bot!',
    description: 'A showcase of beautiful pagination features!\n\nUse the buttons below to navigate through all the amazing features this bot demonstrates.',
    color: 0xff69b4,
    fields: [
      { name: '✨ What you\'ll see:', value: 'Different pagination styles, themes, and features', inline: false },
      { name: '🎯 Navigation:', value: 'Use the cute buttons below to explore!', inline: false },
      { name: '💝 Special:', value: 'Each command shows different capabilities', inline: false }
    ],
    thumbnail: 'https://cdn.discordapp.com/emojis/123456789.png' // Replace with actual emoji URL
  },
  {
    title: '📋 Available Commands',
    description: 'Here are all the commands you can try:',
    color: 0x3498db,
    fields: [
      { name: '/demo-basic', value: 'Basic pagination example', inline: true },
      { name: '/demo-themes', value: 'Different button themes', inline: true },
      { name: '/demo-advanced', value: 'Advanced features showcase', inline: true },
      { name: '/demo-custom', value: 'Custom button example', inline: true },
      { name: '/demo-content', value: 'Content utility demo', inline: true },
      { name: '/demo-public', value: 'Public interaction mode', inline: true },
      { name: '/server-info', value: 'Server information pages', inline: true },
      { name: '/member-list', value: 'Paginated member list', inline: true },
      { name: '/help', value: 'This help menu!', inline: true }
    ]
  },
  {
    title: '🎨 Feature Highlights',
    description: 'What makes Miyuki Pagination special:',
    color: 0xe91e63,
    fields: [
      { name: '🌸 Cute Messages', value: 'Adorable responses with personality', inline: false },
      { name: '⚡ High Performance', value: 'Efficient collectors and memory management', inline: false },
      { name: '🎯 Customizable', value: 'Everything can be personalized', inline: false },
      { name: '🔒 Permission Control', value: 'Author-only or public modes', inline: false },
      { name: '🔄 Loop Navigation', value: 'Seamless page wrapping', inline: false },
      { name: '📊 Page Info', value: 'Built-in information displays', inline: false }
    ]
  },
  {
    title: '💡 Tips & Tricks',
    description: 'Get the most out of your pagination experience:',
    color: 0xf39c12,
    fields: [
      { name: '🎨 Theming', value: 'Use ButtonConfigs for quick styling', inline: false },
      { name: '🔧 Customization', value: 'Override any message or button style', inline: false },
      { name: '📱 Responsiveness', value: 'Works perfectly on mobile and desktop', inline: false },
      { name: '🌐 Internationalization', value: 'Easy to translate all messages', inline: false },
      { name: '⏱️ Timeouts', value: 'Configurable auto-close timers', inline: false }
    ]
  }
];

// 🎯 Slash Commands Definition
const commands = [
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show the help menu with cute pagination! 🌸'),
    
  new SlashCommandBuilder()
    .setName('demo-basic')
    .setDescription('Basic pagination example'),
    
  new SlashCommandBuilder()
    .setName('demo-themes')
    .setDescription('Showcase different button themes'),
    
  new SlashCommandBuilder()
    .setName('demo-advanced')
    .setDescription('Advanced features like page info and jumping'),
    
  new SlashCommandBuilder()
    .setName('demo-custom')
    .setDescription('Custom button configuration example'),
    
  new SlashCommandBuilder()
    .setName('demo-content')
    .setDescription('Content creation utility showcase'),
    
  new SlashCommandBuilder()
    .setName('demo-public')
    .setDescription('Public interaction mode (anyone can navigate)'),
    
  new SlashCommandBuilder()
    .setName('server-info')
    .setDescription('Display server information with pagination'),
    
  new SlashCommandBuilder()
    .setName('member-list')
    .setDescription('Show server members in paginated format')
].map(command => command.toJSON());

// 🚀 Bot Event Handlers
client.once('clientReady', async () => {
  console.log('🌸 Miyuki Bot is online and ready to paginate! ✨');
  
  // Set a cute status
  client.user?.setActivity('with cute pagination 🌸', { 
    type: ActivityType.Playing 
  });
  
  // Register slash commands
  try {
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('✅ Slash commands registered successfully!');
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
});

// 🎯 Slash Command Handler
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    switch (interaction.commandName) {
      case 'help':
        await handleHelpCommand(interaction);
        break;
      case 'demo-basic':
        await handleBasicDemo(interaction);
        break;
      case 'demo-themes':
        await handleThemesDemo(interaction);
        break;
      case 'demo-advanced':
        await handleAdvancedDemo(interaction);
        break;
      case 'demo-custom':
        await handleCustomDemo(interaction);
        break;
      case 'demo-content':
        await handleContentDemo(interaction);
        break;
      case 'demo-public':
        await handlePublicDemo(interaction);
        break;
      case 'server-info':
        await handleServerInfo(interaction);
        break;
      case 'member-list':
        await handleMemberList(interaction);
        break;
    }
  } catch (error) {
    console.error('❌ Command error:', error);
    const errorMessage = '😅 Oops! Something went wrong. Please try again!';
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMessage, ephemeral: true });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
});

// 💬 Prefix Command Handler (bonus feature!)
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith('!')) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();

  if (command === 'help') {
    const embeds = createEmbedsFromContent(helpData);
    const paginator = new MiyukiPaginator({
      embeds,
      buttons: ButtonConfigs.cute(),
      responseMessages: {
        authorOnlyError: '🌸 Only you can navigate this menu! (｡◕‿◕｡)',
        pageInfoTitle: '📋 Navigation Info',
        pageInfoDescription: 'Here\'s some info about this cute paginator! 💝'
      }
    });
    
    await paginator.startMessage(message, { 
      content: '🌸 Here\'s the help menu via prefix command!' 
    });
  }
});

// 🌸 Command Implementations

async function handleHelpCommand(interaction: CommandInteraction) {
  const embeds = createEmbedsFromContent(helpData);
  
  const paginator = new MiyukiPaginator({
    embeds,
    buttons: ButtonConfigs.cute(),
    timeout: 300000, // 5 minutes for help
    showPageNumbers: true,
    allowJumping: false,
    showPageInfo: true,
    responseMessages: {
      authorOnlyError: '🌸 Only you can navigate this help menu! (｡◕‿◕｡)',
      pageInfoTitle: '📊 Help Menu Info',
      pageInfoDescription: 'Information about this adorable help system! 💝',
      timeRemainingValue: '5 minutes until auto-close'
    }
  });

  await paginator.start(interaction);
}

async function handleBasicDemo(interaction: CommandInteraction) {
  const basicEmbeds = [
    new EmbedBuilder()
      .setTitle('📖 Basic Pagination - Page 1')
      .setDescription('This is the most basic pagination example!\n\nJust some embeds with default navigation buttons.')
      .setColor(0x3498db)
      .addFields(
        { name: '✨ Simple', value: 'Easy to implement', inline: true },
        { name: '🎯 Effective', value: 'Gets the job done', inline: true }
      ),
    
    new EmbedBuilder()
      .setTitle('📖 Basic Pagination - Page 2')
      .setDescription('Page numbers are automatically added to the footer!')
      .setColor(0xe74c3c)
      .addFields(
        { name: '🔢 Auto Numbering', value: 'No extra work needed', inline: false },
        { name: '⏱️ Auto Timeout', value: 'Cleans up after 60 seconds', inline: false }
      ),
    
    new EmbedBuilder()
      .setTitle('📖 Basic Pagination - Page 3')
      .setDescription('That\'s it! Simple, effective, and beautiful.')
      .setColor(0x27ae60)
      .addFields(
        { name: '🌟 Result', value: 'Professional pagination in seconds!', inline: false }
      )
  ];

  const paginator = new MiyukiPaginator({ embeds: basicEmbeds });
  await paginator.start(interaction);
}

async function handleThemesDemo(interaction: CommandInteraction) {
  const themeEmbeds = [
    new EmbedBuilder()
      .setTitle('🎨 Theme Showcase - Minimal')
      .setDescription('This page uses the **minimal** button theme!\n\nJust Previous, Stop, and Next buttons.')
      .setColor(0x9b59b6)
      .addFields(
        { name: '🎯 Purpose', value: 'Clean, simple navigation', inline: true },
        { name: '📱 Best For', value: 'Mobile-friendly interfaces', inline: true }
      ),
    
    new EmbedBuilder()
      .setTitle('🎨 Theme Showcase - Simple')
      .setDescription('This would use the **simple** theme if we switched!\n\nOnly Previous and Next - no stop button.')
      .setColor(0x1abc9c)
      .addFields(
        { name: '✨ Ultra Clean', value: 'Absolute minimum interface', inline: true },
        { name: '🚀 Fast', value: 'Quick navigation only', inline: true }
      ),
    
    new EmbedBuilder()
      .setTitle('🎨 Theme Showcase - Cute')
      .setDescription('The **cute** theme with flower emojis! 🌸\n\nPerfect for adding kawaii vibes to your bot!')
      .setColor(0xff69b4)
      .addFields(
        { name: '🌸 Kawaii', value: 'Adorable flower emojis', inline: true },
        { name: '💝 Friendly', value: 'Welcoming button labels', inline: true },
        { name: '🎨 Colorful', value: 'Different button styles', inline: true }
      )
  ];

  // Start with minimal theme, but you could switch themes by recreating the paginator
  const paginator = createMiyukiPaginator({
    embeds: themeEmbeds,
    buttons: ButtonConfigs.minimal()
  });

  await paginator.start(interaction);
}

async function handleAdvancedDemo(interaction: CommandInteraction) {
  const advancedEmbeds = Array.from({ length: 8 }, (_, i) => 
    new EmbedBuilder()
      .setTitle(`🚀 Advanced Features - Page ${i + 1}`)
      .setDescription(`This showcase demonstrates advanced pagination features!\n\nPage ${i + 1} of 8 - Try all the buttons!`)
      .setColor([0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6, 0x1abc9c, 0xff69b4, 0x95a5a6][i]as ColorResolvable)
      .addFields(
        { name: '🔄 Loop Navigation', value: 'Pages wrap around seamlessly', inline: true },
        { name: '📊 Page Info', value: 'Click the info button!', inline: true },
        { name: '🎯 Jump Feature', value: 'Jump to specific pages', inline: true },
        { name: '⏱️ Long Timeout', value: '3 minutes before auto-close', inline: false }
      )
  );

  const paginator = new MiyukiPaginator({
    embeds: advancedEmbeds,
    buttons: ButtonConfigs.advanced(),
    loopPages: true,
    allowJumping: true,
    showPageInfo: true,
    timeout: 180000, // 3 minutes
    responseMessages: {
      pageInfoTitle: '🚀 Advanced Paginator Info',
      pageInfoDescription: 'This paginator has ALL the features enabled! ✨',
      jumpToPageContent: '🎯 Jump functionality demo!\nCurrent: {current}/{total}\n\nIn a real implementation, this would open a modal! (◕‿◕)'
    }
  });

  await paginator.start(interaction);
}

async function handleCustomDemo(interaction: CommandInteraction) {
  const customEmbeds = [
    new EmbedBuilder()
      .setTitle('🎨 Custom Button Demo')
      .setDescription('This paginator uses completely custom button styling!')
      .setColor(0xff6b35)
      .addFields(
        { name: '🎭 Custom Emojis', value: 'Unique emojis for each button', inline: true },
        { name: '🎨 Custom Styles', value: 'Different Discord button styles', inline: true },
        { name: '📝 Custom Labels', value: 'Personalized button text', inline: true }
      ),
    
    new EmbedBuilder()
      .setTitle('✨ Styling Options')
      .setDescription('You can customize everything about the buttons!')
      .setColor(0x4ecdc4)
      .addFields(
        { name: 'Button Styles', value: 'Primary, Secondary, Success, Danger', inline: false },
        { name: 'Positioning', value: 'Control button order with position property', inline: false },
        { name: 'Flexibility', value: 'Mix and match any way you want!', inline: false }
      )
  ];

  const customButtons: CustomButton[] = [
    {
      type: PaginatorButtonType.FIRST,
      emoji: '⏪',
      label: 'Start',
      style: ButtonStyle.Secondary,
      position: 0
    },
    {
      type: PaginatorButtonType.PREVIOUS,
      emoji: '👈',
      label: 'Back',
      style: ButtonStyle.Primary,
      position: 1
    },
    {
      type: PaginatorButtonType.INFO,
      emoji: '📋',
      label: 'Details',
      style: ButtonStyle.Secondary,
      position: 2
    },
    {
      type: PaginatorButtonType.NEXT,
      emoji: '👉',
      label: 'Forward',
      style: ButtonStyle.Primary,
      position: 3
    },
    {
      type: PaginatorButtonType.LAST,
      emoji: '⏩',
      label: 'End',
      style: ButtonStyle.Secondary,
      position: 4
    },
    {
      type: PaginatorButtonType.STOP,
      emoji: '🛑',
      label: 'Close',
      style: ButtonStyle.Danger,
      position: 5
    }
  ];

  const paginator = new MiyukiPaginator({
    embeds: customEmbeds,
    buttons: customButtons,
    showPageInfo: true,
    responseMessages: {
      pageInfoTitle: '🎨 Custom Button Info',
      pageInfoDescription: 'Look at these beautifully customized buttons! 🌟'
    }
  });

  await paginator.start(interaction);
}

async function handleContentDemo(interaction: CommandInteraction) {
  // Demonstrate the content utility function
  const contentData: PaginatedContent[] = [
    {
      title: '🛠️ Content Utility Demo',
      description: 'This pagination was created using the `createEmbedsFromContent` utility!',
      color: 0x8e44ad,
      fields: [
        { name: '✨ Easy Creation', value: 'Convert objects to embeds instantly', inline: true },
        { name: '🎯 Structured Data', value: 'Perfect for consistent formatting', inline: true }
      ]
    },
    {
      title: '📊 Data Example',
      description: 'Here\'s how easy it is to create structured content:',
      color: 0x27ae60,
      fields: [
        { name: 'Step 1', value: 'Define your content objects', inline: false },
        { name: 'Step 2', value: 'Use createEmbedsFromContent()', inline: false },
        { name: 'Step 3', value: 'Pass to MiyukiPaginator!', inline: false }
      ]
    },
    {
      title: '🎨 Styling Features',
      description: 'Content objects support all embed features:',
      color: 0xe67e22,
      fields: [
        { name: 'Colors', value: 'Hex color codes', inline: true },
        { name: 'Fields', value: 'Structured field data', inline: true },
        { name: 'Images', value: 'Thumbnails and main images', inline: true }
      ],
      thumbnail: 'https://cdn.discordapp.com/emojis/123456789.png' // Replace with actual URL
    }
  ];

  const embeds = createEmbedsFromContent(contentData);
  const paginator = new MiyukiPaginator({
    embeds,
    buttons: ButtonConfigs.cute(),
    showPageNumbers: true
  });

  await paginator.start(interaction);
}

async function handlePublicDemo(interaction: CommandInteraction) {
  const publicEmbeds = [
    new EmbedBuilder()
      .setTitle('👥 Public Interaction Mode')
      .setDescription('**Anyone** can navigate this paginator!\n\nTry having different users click the buttons.')
      .setColor(0x00ff00)
      .addFields(
        { name: '🌟 Feature', value: 'authorOnly: false', inline: true },
        { name: '👥 Benefit', value: 'Shared navigation experience', inline: true },
        { name: '⚠️ Note', value: 'Use wisely in busy channels!', inline: false }
      ),
    
    new EmbedBuilder()
      .setTitle('🎯 Use Cases')
      .setDescription('When to use public interaction mode:')
      .setColor(0x3498db)
      .addFields(
        { name: '📚 Information Displays', value: 'Help menus, documentation', inline: false },
        { name: '🎮 Interactive Content', value: 'Polls, games, shared experiences', inline: false },
        { name: '📊 Data Browsing', value: 'Server stats, leaderboards', inline: false }
      ),
    
    new EmbedBuilder()
      .setTitle('⚙️ Configuration')
      .setDescription('Easy to enable:')
      .setColor(0xe74c3c)
      .addFields(
        { name: 'Code', value: '```typescript\nnew MiyukiPaginator({\n  embeds: myEmbeds,\n  authorOnly: false\n})\n```', inline: false },
        { name: '💡 Tip', value: 'Consider longer timeouts for public use', inline: false }
      )
  ];

  const paginator = new MiyukiPaginator({
    embeds: publicEmbeds,
    authorOnly: false, // 👥 Anyone can navigate!
    timeout: 300000, // 5 minutes for public use
    buttons: ButtonConfigs.minimal(),
    responseMessages: {
      authorOnlyError: '👥 Everyone can use this paginator!', // Won't be used, but good practice
    }
  });

  await paginator.start(interaction);
}

async function handleServerInfo(interaction: CommandInteraction) {
  const guild = interaction.guild;
  if (!guild) {
    await interaction.reply({ content: '❌ This command only works in servers!', ephemeral: true });
    return;
  }

  const serverInfoData: PaginatedContent[] = [
    {
      title: `📊 ${guild.name} - Overview`,
      description: `General information about **${guild.name}**`,
      color: 0x7289da,
      thumbnail: guild.iconURL() || undefined,
      fields: [
        { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: '📅 Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
        { name: '🆔 Server ID', value: guild.id, inline: true },
        { name: '👥 Members', value: guild.memberCount.toString(), inline: true },
        { name: '💬 Channels', value: guild.channels.cache.size.toString(), inline: true },
        { name: '🎭 Roles', value: guild.roles.cache.size.toString(), inline: true }
      ]
    },
    {
      title: `🛡️ ${guild.name} - Security`,
      description: 'Server security and verification settings',
      color: 0xff6b6b,
      fields: [
        { name: '🔒 Verification Level', value: guild.verificationLevel.toString(), inline: true },
        { name: '🛡️ MFA Requirement', value: guild.mfaLevel ? 'Required' : 'Not Required', inline: true },
        { name: '📝 Content Filter', value: guild.explicitContentFilter.toString(), inline: true }
      ]
    },
    {
      title: `✨ ${guild.name} - Features`,
      description: 'Special server features and boosts',
      color: 0xf368e0,
      fields: [
        { name: '🚀 Boost Level', value: `Level ${guild.premiumTier}`, inline: true },
        { name: '💎 Boost Count', value: guild.premiumSubscriptionCount?.toString() || '0', inline: true },
        { name: '📈 Max Members', value: guild.maximumMembers?.toString() || 'Unknown', inline: true }
      ]
    }
  ];

  const embeds = createEmbedsFromContent(serverInfoData);
  const paginator = new MiyukiPaginator({
    embeds,
    buttons: ButtonConfigs.advanced(),
    showPageInfo: true,
    allowJumping: false,
    timeout: 120000
  });

  await paginator.start(interaction);
}

async function handleMemberList(interaction: CommandInteraction) {
  const guild = interaction.guild;
  if (!guild) {
    await interaction.reply({ content: '❌ This command only works in servers!', ephemeral: true });
    return;
  }

  await interaction.deferReply();

  try {
    const members = await guild.members.fetch();
    const memberArray = Array.from(members.values());
    const membersPerPage = 10;
    const pages: EmbedBuilder[] = [];

    for (let i = 0; i < memberArray.length; i += membersPerPage) {
      const pageMembers = memberArray.slice(i, i + membersPerPage);
      const pageNumber = Math.floor(i / membersPerPage) + 1;
      const totalPages = Math.ceil(memberArray.length / membersPerPage);

      const embed = new EmbedBuilder()
        .setTitle(`👥 ${guild.name} Members`)
        .setDescription(`Showing ${pageMembers.length} members (Page ${pageNumber}/${totalPages})`)
        .setColor(0x00ff00);

      pageMembers.forEach((member, index) => {
        const globalIndex = i + index + 1;
        const joinedDate = member.joinedAt ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:R>` : 'Unknown';
        
        embed.addFields({
          name: `${globalIndex}. ${member.displayName}`,
          value: `${member.user.tag}\nJoined: ${joinedDate}\nRoles: ${member.roles.cache.size - 1}`, // -1 for @everyone
          inline: true
        });
      });

      pages.push(embed);
    }

    const paginator = new MiyukiPaginator({
      embeds: pages,
      buttons: ButtonConfigs.advanced(),
      authorOnly: false, // Let others browse the member list
      showPageInfo: true,
      allowJumping: true,
      loopPages: false,
      timeout: 300000, // 5 minutes
      responseMessages: {
        pageInfoTitle: '👥 Member List Info',
        pageInfoDescription: `Browse through all ${memberArray.length} server members! 🌟`,
        jumpToPageContent: '🎯 Jump to a specific page!\nCurrent: {current}/{total}\n\n💡 In a full implementation, you could jump to specific members!'
      }
    });

    // Reply with the paginator, then fetch the message for the collector
    await interaction.editReply({
      embeds: [paginator['getCurrentEmbed']()],
      components: paginator['createButtonRows']()
    });

    const reply = await interaction.fetchReply();
    paginator['setupCollector'](reply, interaction.user.id);
  } catch (error) {
    console.error('Error fetching members:', error);
    await interaction.followUp({ 
      content: '❌ Failed to fetch server members. Make sure I have the right permissions!', 
      ephemeral: true 
    });
  }
}

// 🚀 Start the bot
client.login(TOKEN).catch(console.error);

