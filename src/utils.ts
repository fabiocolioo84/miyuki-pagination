import { ButtonStyle, EmbedBuilder } from "discord.js";
import { MiyukiPaginator } from "./paginator";
import {
  type PaginatorOptions,
  type CustomButton,
  PaginatorButtonType,
} from "./types";

/**
 * Factory function for creating MiyukiPaginator instances.
 * Provides a clean, functional approach to paginator creation.
 * 
 * @param options - Configuration options for the paginator
 * @returns A new MiyukiPaginator instance ready to use
 * @example
 * ```typescript
 * const paginator = createMiyukiPaginator({
 *   embeds: myEmbeds,
 *   timeout: 30000,
 *   authorOnly: false
 * });
 * ```
 */
export function createMiyukiPaginator(
  options: PaginatorOptions
): MiyukiPaginator {
  return new MiyukiPaginator(options);
}

/**
 * Pre-configured button layouts for common use cases.
 * Save time with these adorable, tested configurations! 🌸
 */
export const ButtonConfigs = {
  /**
   * Minimal navigation: Previous, Stop, Next
   * Perfect for simple navigation without overwhelming users.
   * 
   * @returns Array of buttons for minimal navigation
   * @example
   * ```typescript
   * const paginator = new MiyukiPaginator({
   *   embeds: myEmbeds,
   *   buttons: ButtonConfigs.minimal()
   * });
   * ```
   */
  minimal: (): CustomButton[] => [
    { type: PaginatorButtonType.PREVIOUS },
    { type: PaginatorButtonType.STOP },
    { type: PaginatorButtonType.NEXT },
  ],

  /**
   * Super simple: Just Previous and Next
   * For when you want the absolute minimum interface.
   * 
   * @returns Array of buttons for simple navigation
   */
  simple: (): CustomButton[] => [
    { type: PaginatorButtonType.PREVIOUS },
    { type: PaginatorButtonType.NEXT },
  ],

  /**
   * Advanced navigation with all features
   * Includes first/last navigation, info, jumping, and stop functionality.
   * 
   * @returns Array of buttons for advanced navigation
   */
  advanced: (): CustomButton[] => [
    { type: PaginatorButtonType.FIRST },
    { type: PaginatorButtonType.PREVIOUS },
    { type: PaginatorButtonType.INFO },
    { type: PaginatorButtonType.NEXT },
    { type: PaginatorButtonType.LAST },
    { type: PaginatorButtonType.JUMP },
    { type: PaginatorButtonType.STOP },
  ],

  /**
   * Cute themed buttons with flower emojis and friendly labels
   * Perfect for adding a kawaii touch to your bot! (◕‿◕)
   * 
   * @returns Array of buttons with cute styling
   */
  cute: (): CustomButton[] => [
    {
      type: PaginatorButtonType.PREVIOUS,
      emoji: "🌸",
      label: "Back",
      style: ButtonStyle.Secondary,
    },
    {
      type: PaginatorButtonType.STOP,
      emoji: "💝",
      label: "Done",
      style: ButtonStyle.Success,
    },
    {
      type: PaginatorButtonType.NEXT,
      emoji: "🌺",
      label: "Forward",
      style: ButtonStyle.Secondary,
    },
  ],
};

/**
 * Interface for structured content that can be easily converted to embeds.
 * Perfect for when you have data objects that need to become paginated embeds.
 */
export interface PaginatedContent {
  /** 
   * The title of the embed
   * @example "User Profile", "Server Stats"
   */
  title: string;
  
  /** 
   * The main description/content of the embed
   * @example "Welcome to our amazing server!"
   */
  description: string;
  
  /** 
   * Embed color as a hexadecimal number
   * @example 0xff69b4, 0x00ff00
   */
  color?: number;
  
  /** 
   * Array of embed fields for structured data
   * @example [{ name: "Level", value: "42", inline: true }]
   */
  fields?: { name: string; value: string; inline?: boolean }[];
  
  /** 
   * URL for the large embed image
   * @example "https://example.com/image.png"
   */
  image?: string;
  
  /** 
   * URL for the small thumbnail image
   * @example "https://example.com/avatar.png"
   */
  thumbnail?: string;
}

/**
 * Converts an array of content objects into EmbedBuilder instances.
 * Super convenient for transforming your data into paginated embeds!
 * 
 * @param content - Array of content objects to convert
 * @returns Array of EmbedBuilder instances ready for pagination
 * @example
 * ```typescript
 * const content = [
 *   {
 *     title: "Page 1",
 *     description: "First page content",
 *     color: 0xff69b4,
 *     fields: [{ name: "Field", value: "Value", inline: true }]
 *   },
 *   {
 *     title: "Page 2", 
 *     description: "Second page content",
 *     color: 0x00ff00
 *   }
 * ];
 * 
 * const embeds = createEmbedsFromContent(content);
 * const paginator = new MiyukiPaginator({ embeds });
 * ```
 */
export function createEmbedsFromContent(
  content: PaginatedContent[]
): EmbedBuilder[] {
  return content.map((item) => {
    const embed = new EmbedBuilder()
      .setTitle(item.title)
      .setDescription(item.description);

    if (item.color) embed.setColor(item.color);
    if (item.fields) embed.addFields(item.fields);
    if (item.image) embed.setImage(item.image);
    if (item.thumbnail) embed.setThumbnail(item.thumbnail);

    return embed;
  });
}