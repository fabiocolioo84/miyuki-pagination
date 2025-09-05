import {
  ButtonInteraction,
  CommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  Message,
  type MessageCreateOptions,
  type CollectorFilter,
} from "discord.js";
import {
  type CustomButton,
  type PaginatorOptions,
  type ResponseMessages,
  PaginatorButtonType,
} from "./types";

/**
 * A delightfully cute and professional Discord paginator! ✨
 *
 * MiyukiPaginator helps you create beautiful, interactive embed pagination
 * with customizable buttons, messages, and behaviors. Perfect for displaying
 * large amounts of data in a user-friendly way.
 *
 * @example
 * ```typescript
 * const paginator = new MiyukiPaginator({
 *   embeds: myEmbeds,
 *   timeout: 30000,
 *   showPageNumbers: true
 * });
 * await paginator.start(interaction);
 * ```
 */
export class MiyukiPaginator {
  /** Array of embeds to paginate through */
  private embeds: EmbedBuilder[];

  /** Current page index (0-based) */
  private currentPage: number = 0;

  /** Timeout duration in milliseconds before auto-close */
  private timeout: number;

  /** Custom button configurations for the paginator */
  private buttons: CustomButton[];

  /** Text labels for each button type */
  private buttonLabels: Record<string, string>;

  /** Emoji configurations for each button type */
  private buttonEmojis: Record<string, string>;

  /** All response messages used throughout the paginator */
  private responseMessages: Required<ResponseMessages>;

  /** Whether to show "Page X of Y" in embed footer */
  private showPageNumbers: boolean;

  /** Whether only the command author can interact */
  private authorOnly: boolean;

  /** Maximum number of buttons per row (Discord limit: 5) */
  private maxButtonsPerRow: number;

  /** Whether to enable the jump-to-page feature */
  private allowJumping: boolean;

  /** Whether to show the page info button */
  private showPageInfo: boolean;

  /** Whether to loop pages (last -> first, first -> last) */
  private loopPages: boolean;

  /**
   * Creates a new MiyukiPaginator instance with adorable defaults! 🌸
   *
   * @param options - Configuration options for the paginator
   * @throws {Error} When embeds array is empty (handled gracefully in start methods)
   */
  constructor(options: PaginatorOptions) {
    this.embeds = options.embeds;
    this.timeout = options.timeout ?? 60000;
    this.showPageNumbers = options.showPageNumbers ?? true;
    this.authorOnly = options.authorOnly ?? true;
    this.maxButtonsPerRow = options.maxButtonsPerRow ?? 5;
    this.allowJumping = options.allowJumping ?? false;
    this.showPageInfo = options.showPageInfo ?? false;
    this.loopPages = options.loopPages ?? false;
    this.buttons = options.buttons ?? [];

    this.buttonLabels = {
      first: "First Page",
      previous: "Previous",
      next: "Next",
      last: "Last Page",
      stop: "Close",
      jump: "Jump to...",
      info: "Page Info",
      ...options.buttonLabels,
    };

    this.buttonEmojis = {
      first: "⏮️",
      previous: "◀️",
      next: "▶️",
      last: "⏭️",
      stop: "❌",
      jump: "🔢",
      info: "ℹ️",
      ...options.buttonEmojis,
    };

    this.responseMessages = {
      authorOnlyError:
        "❌ Only the person who used the command can navigate! (｡•́︿•̀｡)",
      noEmbedsError: "❌ No embeds to paginate! That's so sad... (´｡• ω •｡`)",
      pageInfoTitle: "📊 Page Information",
      pageInfoDescription: "Here's some cute info about this paginator! (◕‿◕)",
      currentPageField: "📄 Current Page",
      totalPagesField: "📚 Total Pages",
      timeRemainingField: "⏱️ Time Remaining",
      timeRemainingValue: "Until auto-close",
      jumpToPageContent:
        "🔢 Jump to page feature! Current: {current}/{total}\nPsst... this would normally open a modal for page selection! (｡◕‿◕｡)",
      pageChanged: "✨ Page changed successfully! (◕‿◕)",
      paginatorClosed: "👋 Paginator closed! Thanks for using it! (｡◕‿‿◕｡)",
      ...options.responseMessages,
    };

    this.setupButtons(options);
  }

  /**
   * Sets up the button configuration based on provided options.
   * Creates default button layouts if none specified.
   *
   * @param options - The paginator options containing button configurations
   * @private
   */
  private setupButtons(options: PaginatorOptions): void {
    if (Array.isArray(options.buttons) && options.buttons.length > 0) {
      this.buttons = [...options.buttons].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0)
      );
    } else if (options.useDefaultButtons === false) {
      this.buttons = [
        { type: PaginatorButtonType.PREVIOUS, position: 0 },
        { type: PaginatorButtonType.STOP, position: 1 },
        { type: PaginatorButtonType.NEXT, position: 2 },
      ];
    } else {
      this.buttons = [
        { type: PaginatorButtonType.FIRST, position: 0 },
        { type: PaginatorButtonType.PREVIOUS, position: 1 },
        { type: PaginatorButtonType.STOP, position: 2 },
        { type: PaginatorButtonType.NEXT, position: 3 },
        { type: PaginatorButtonType.LAST, position: 4 },
      ];

      if (this.allowJumping) {
        this.buttons.push({ type: PaginatorButtonType.JUMP, position: 5 });
      }
      if (this.showPageInfo) {
        this.buttons.push({ type: PaginatorButtonType.INFO, position: 6 });
      }
    }
  }

  /**
   * Creates action rows with buttons, respecting the max buttons per row limit.
   * Automatically distributes buttons across multiple rows if needed.
   *
   * @returns Array of action rows containing the configured buttons
   * @private
   */
  private createButtonRows(): ActionRowBuilder<ButtonBuilder>[] {
    const buttons: ButtonBuilder[] = [];

    for (const buttonConfig of this.buttons) {
      const button = this.createButton(buttonConfig);
      if (button) buttons.push(button);
    }

    const rows: ActionRowBuilder<ButtonBuilder>[] = [];
    for (let i = 0; i < buttons.length; i += this.maxButtonsPerRow) {
      const row = new ActionRowBuilder<ButtonBuilder>();
      row.addComponents(buttons.slice(i, i + this.maxButtonsPerRow));
      rows.push(row);
    }

    return rows;
  }

  /**
   * Creates a single button based on the provided configuration.
   * Handles styling, labels, emojis, and disabled states automatically.
   *
   * @param config - The button configuration object
   * @returns A configured ButtonBuilder instance, or null if invalid
   * @private
   */
  private createButton(config: CustomButton): ButtonBuilder | null {
    const customId = `paginator_${config.type}`;
    const label = config.label ?? this.buttonLabels[config.type];
    const emoji = config.emoji ?? this.buttonEmojis[config.type];
    const style = config.style ?? this.getDefaultButtonStyle(config.type);

    const button = new ButtonBuilder().setCustomId(customId).setStyle(style);

    if (label) button.setLabel(label);
    if (emoji) button.setEmoji(emoji);

    switch (config.type) {
      case PaginatorButtonType.FIRST:
      case PaginatorButtonType.PREVIOUS:
        button.setDisabled(this.currentPage === 0 && !this.loopPages);
        break;
      case PaginatorButtonType.NEXT:
      case PaginatorButtonType.LAST:
        button.setDisabled(
          this.currentPage === this.embeds.length - 1 && !this.loopPages
        );
        break;
      default:
        break;
    }

    return button;
  }

  /**
   * Returns the appropriate default button style for each button type.
   * Provides sensible styling defaults while allowing customization.
   *
   * @param type - The type of button to get the default style for
   * @returns The appropriate ButtonStyle for the given type
   * @private
   */
  private getDefaultButtonStyle(type: PaginatorButtonType): ButtonStyle {
    switch (type) {
      case PaginatorButtonType.STOP:
        return ButtonStyle.Danger;
      case PaginatorButtonType.INFO:
        return ButtonStyle.Secondary;
      case PaginatorButtonType.JUMP:
        return ButtonStyle.Secondary;
      default:
        return ButtonStyle.Primary;
    }
  }

  /**
   * Gets the current embed with optional page numbers in the footer.
   * Preserves existing footer content when adding page information.
   *
   * @returns A copy of the current embed with page numbers (if enabled)
   * @private
   */
  private getCurrentEmbed(): EmbedBuilder {
    const embed = EmbedBuilder.from(this.embeds[this.currentPage]!);

    if (this.showPageNumbers) {
      const footer = embed.data.footer;
      const pageText = `Page ${this.currentPage + 1} of ${this.embeds.length}`;

      if (footer?.text) {
        embed.setFooter({
          text: `${footer.text} • ${pageText}`,
          iconURL: footer.icon_url,
        });
      } else {
        embed.setFooter({ text: pageText });
      }
    }

    return embed;
  }

  /**
   * Handles all button interactions for the paginator.
   * Manages page navigation, permissions, and special button actions.
   *
   * @param interaction - The button interaction from Discord
   * @param message - The message containing the paginator
   * @param authorId - The ID of the user who started the paginator (optional)
   * @private
   */
  private async handleButtonInteraction(
    interaction: ButtonInteraction,
    message: Message,
    authorId?: string
  ): Promise<void> {
    if (this.authorOnly && authorId && interaction.user.id !== authorId) {
      await interaction.reply({
        content: this.responseMessages.authorOnlyError,
        flags: "Ephemeral",
      });
      return;
    }

    const buttonType = interaction.customId.replace(
      "paginator_",
      ""
    ) as PaginatorButtonType;

    switch (buttonType) {
      case PaginatorButtonType.FIRST:
        this.currentPage = 0;
        break;
      case PaginatorButtonType.PREVIOUS:
        if (this.loopPages && this.currentPage === 0) {
          this.currentPage = this.embeds.length - 1;
        } else {
          this.currentPage = Math.max(0, this.currentPage - 1);
        }
        break;
      case PaginatorButtonType.NEXT:
        if (this.loopPages && this.currentPage === this.embeds.length - 1) {
          this.currentPage = 0;
        } else {
          this.currentPage = Math.min(
            this.embeds.length - 1,
            this.currentPage + 1
          );
        }
        break;
      case PaginatorButtonType.LAST:
        this.currentPage = this.embeds.length - 1;
        break;
      case PaginatorButtonType.STOP:
        await interaction.update({
          embeds: [this.getCurrentEmbed()],
          components: [],
        });
        return;
      case PaginatorButtonType.INFO:
        await this.handlePageInfo(interaction);
        return;
      case PaginatorButtonType.JUMP:
        await this.handleJumpToPage(interaction);
        return;
    }

    await interaction.update({
      embeds: [this.getCurrentEmbed()],
      components: this.createButtonRows(),
    });
  }

  /**
   * Handles the page info button interaction.
   * Shows detailed information about the current paginator state.
   *
   * @param interaction - The button interaction for the info button
   * @private
   */
  private async handlePageInfo(interaction: ButtonInteraction): Promise<void> {
    const infoEmbed = new EmbedBuilder()
      .setTitle(this.responseMessages.pageInfoTitle)
      .setDescription(this.responseMessages.pageInfoDescription)
      .addFields([
        {
          name: this.responseMessages.currentPageField,
          value: `${this.currentPage + 1}`,
          inline: true,
        },
        {
          name: this.responseMessages.totalPagesField,
          value: `${this.embeds.length}`,
          inline: true,
        },
        {
          name: this.responseMessages.timeRemainingField,
          value: this.responseMessages.timeRemainingValue,
          inline: true,
        },
      ])
      .setColor(0xff69b4)
      .setTimestamp();

    await interaction.reply({
      embeds: [infoEmbed],
      flags: "Ephemeral",
    });
  }

  /**
   * Handles the jump to page button interaction.
   * In a full implementation, this would open a modal for page selection.
   *
   * @param interaction - The button interaction for the jump button
   * @private
   */
  private async handleJumpToPage(
    interaction: ButtonInteraction
  ): Promise<void> {
    const content = this.responseMessages.jumpToPageContent
      .replace("{current}", `${this.currentPage + 1}`)
      .replace("{total}", `${this.embeds.length}`);

    await interaction.reply({
      content,
      flags: "Ephemeral",
    });
  }

  /**
   * Starts the paginator from a slash command interaction.
   * Handles edge cases like empty embeds or single pages gracefully.
   *
   * @param interaction - The command interaction that triggered the paginator
   * @example
   * ```typescript
   * const paginator = new MiyukiPaginator({ embeds: myEmbeds });
   * await paginator.start(interaction);
   * ```
   */
  async start(interaction: CommandInteraction): Promise<void> {
    if (this.embeds.length === 0) {
      await interaction.reply({
        content: this.responseMessages.noEmbedsError,
        flags: "Ephemeral",
      });
      return;
    }

    if (this.embeds.length === 1) {
      await interaction.reply({
        embeds: [this.getCurrentEmbed()],
      });
      return;
    }

    const reply = await interaction
      .reply({
        embeds: [this.getCurrentEmbed()],
        components: this.createButtonRows(),
        withResponse: true,
      })
      .then(() => interaction.fetchReply());

    this.setupCollector(reply, interaction.user.id);
  }

  /**
   * Starts the paginator from a regular message.
   * Provides the same functionality as start() but for non-slash commands.
   *
   * @param message - The message to reply to with the paginator
   * @param replyOptions - Additional options for the reply (excluding components and embeds)
   * @example
   * ```typescript
   * const paginator = new MiyukiPaginator({ embeds: myEmbeds });
   * await paginator.startMessage(message, { content: "Here's your data!" });
   * ```
   */
  async startMessage(
    message: Message,
    replyOptions: Omit<MessageCreateOptions, "components" | "embeds"> = {}
  ): Promise<void> {
    if (this.embeds.length === 0) {
      await message.reply({
        content: this.responseMessages.noEmbedsError,
        ...replyOptions,
      });
      return;
    }

    if (this.embeds.length === 1) {
      await message.reply({
        embeds: [this.getCurrentEmbed()],
        ...replyOptions,
      });
      return;
    }

    const reply = await message.reply({
      embeds: [this.getCurrentEmbed()],
      components: this.createButtonRows(),
      ...replyOptions,
    });

    this.setupCollector(reply, message.author.id);
  }

  /**
   * Sets up the message component collector for button interactions.
   * Handles timeouts and cleanup automatically.
   *
   * @param message - The message to collect interactions from
   * @param authorId - The ID of the user who can interact (if authorOnly is enabled)
   * @private
   */
  private setupCollector(message: Message, authorId: string): void {
    const filter: CollectorFilter<[ButtonInteraction]> = (
      buttonInteraction: ButtonInteraction
    ): boolean => {
      return buttonInteraction.customId.startsWith("paginator_");
    };

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter,
      time: this.timeout,
    });

    collector.on("collect", async (buttonInteraction: ButtonInteraction) => {
      await this.handleButtonInteraction(buttonInteraction, message, authorId);
    });

    collector.on("end", async () => {
      try {
        if (message.editable) {
          await message.edit({
            embeds: [this.getCurrentEmbed()],
            components: [],
          });
        }
      } catch (error) {}
    });
  }

  /**
   * Updates a single response message for the paginator.
   * Useful for customizing messages after instantiation.
   *
   * @param key - The message key to update
   * @param value - The new message value
   * @example
   * ```typescript
   * paginator.updateResponseMessage('authorOnlyError', 'Custom error message!');
   * ```
   */
  public updateResponseMessage(
    key: keyof ResponseMessages,
    value: string
  ): void {
    (this.responseMessages as Record<string, string>)[key] = value;
  }

  /**
   * Updates multiple response messages at once.
   * More efficient than calling updateResponseMessage multiple times.
   *
   * @param messages - Object containing the messages to update
   * @example
   * ```typescript
   * paginator.updateMultipleMessages({
   *   authorOnlyError: 'Custom error!',
   *   noEmbedsError: 'No content found!'
   * });
   * ```
   */
  public updateMultipleMessages(messages: Partial<ResponseMessages>): void {
    Object.assign(this.responseMessages, messages);
  }

  /**
   * Gets a specific response message by key.
   * Useful for retrieving current message values.
   *
   * @param key - The message key to retrieve
   * @returns The current message value for the specified key
   */
  public getResponseMessage(key: keyof ResponseMessages): string {
    return this.responseMessages[key];
  }

  /**
   * Gets all current response messages.
   * Returns a copy to prevent external modifications.
   *
   * @returns A complete copy of all response messages
   */
  public getAllResponseMessages(): Required<ResponseMessages> {
    return { ...this.responseMessages };
  }
}
