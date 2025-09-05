import type { ButtonStyle, EmbedBuilder } from "discord.js";

/**
 * Enum defining all available paginator button types.
 * Each type corresponds to a specific navigation or utility function.
 */
export enum PaginatorButtonType {
  /** Navigate to the very first page */
  FIRST = "first",
  
  /** Navigate to the previous page */
  PREVIOUS = "previous",
  
  /** Navigate to the next page */
  NEXT = "next",
  
  /** Navigate to the very last page */
  LAST = "last",
  
  /** Close/stop the paginator */
  STOP = "stop",
  
  /** Open jump-to-page functionality */
  JUMP = "jump",
  
  /** Show paginator information */
  INFO = "info",
}

/**
 * Configuration interface for customizing individual paginator buttons.
 * All properties except 'type' are optional and will use sensible defaults.
 */
export interface CustomButton {
  /** The type/function of this button */
  type: PaginatorButtonType;
  
  /** 
   * Custom text label for the button
   * @example "Previous Page", "◀ Back"
   */
  label?: string;
  
  /** 
   * Custom emoji for the button (can be Unicode or custom Discord emoji)
   * @example "🌸", "<:custom:123456789>"
   */
  emoji?: string;
  
  /** 
   * Discord button style (Primary, Secondary, Success, Danger, Link)
   * @default Depends on button type
   */
  style?: ButtonStyle;
  
  /** 
   * Position/order of the button (lower numbers appear first)
   * @default 0
   */
  position?: number;
}

/**
 * Interface for customizing all response messages used by the paginator.
 * Perfect for internationalization or adding your own cute personality! ✨
 */
export interface ResponseMessages {
  /** 
   * Error message when non-author tries to interact (when authorOnly is true)
   * @default "❌ Only the person who used the command can navigate! (｡•́︿•̀｡)"
   */
  authorOnlyError?: string;
  
  /** 
   * Error message when embeds array is empty
   * @default "❌ No embeds to paginate! That's so sad... (´｡• ω •｡`)"
   */
  noEmbedsError?: string;
  
  /** 
   * Title for the page information embed
   * @default "📊 Page Information"
   */
  pageInfoTitle?: string;
  
  /** 
   * Description for the page information embed
   * @default "Here's some cute info about this paginator! (◕‿◕)"
   */
  pageInfoDescription?: string;
  
  /** 
   * Field name for current page in info embed
   * @default "📄 Current Page"
   */
  currentPageField?: string;
  
  /** 
   * Field name for total pages in info embed
   * @default "📚 Total Pages"
   */
  totalPagesField?: string;
  
  /** 
   * Field name for time remaining in info embed
   * @default "⏱️ Time Remaining"
   */
  timeRemainingField?: string;
  
  /** 
   * Value for time remaining field in info embed
   * @default "Until auto-close"
   */
  timeRemainingValue?: string;
  
  /** 
   * Message content for jump-to-page functionality
   * Supports {current} and {total} placeholders
   * @default "🔢 Jump to page feature! Current: {current}/{total}\nPsst... this would normally open a modal for page selection! (｡◕‿◕｡)"
   */
  jumpToPageContent?: string;
  
  /** 
   * Success message when page changes (currently unused but available for extensions)
   * @default "✨ Page changed successfully! (◕‿◕)"
   */
  pageChanged?: string;
  
  /** 
   * Message when paginator is closed (currently unused but available for extensions)
   * @default "👋 Paginator closed! Thanks for using it! (｡◕‿‿◕｡)"
   */
  paginatorClosed?: string;
}

/**
 * Main configuration interface for creating a MiyukiPaginator instance.
 * Only 'embeds' is required - everything else has sensible defaults!
 */
export interface PaginatorOptions {
  /** 
   * Array of embeds to paginate through
   * @required This is the only required field!
   */
  embeds: EmbedBuilder[];
  
  /** 
   * How long to keep the paginator active (in milliseconds)
   * @default 60000 (1 minute)
   */
  timeout?: number;
  
  /** 
   * Custom button configurations
   * If not provided, will use default button set
   */
  buttons?: CustomButton[];
  
  /** 
   * Whether to use default buttons when no custom buttons specified
   * Set to false for a minimal button set
   * @default true
   */
  useDefaultButtons?: boolean;
  
  /** 
   * Custom labels for default button types
   * Only affects buttons that don't have custom labels in their config
   */
  buttonLabels?: {
    /** @default "First Page" */
    first?: string;
    /** @default "Previous" */
    previous?: string;
    /** @default "Next" */
    next?: string;
    /** @default "Last Page" */
    last?: string;
    /** @default "Close" */
    stop?: string;
    /** @default "Jump to..." */
    jump?: string;
    /** @default "Page Info" */
    info?: string;
  };
  
  /** 
   * Custom emojis for default button types
   * Only affects buttons that don't have custom emojis in their config
   */
  buttonEmojis?: {
    /** @default "⏮️" */
    first?: string;
    /** @default "◀️" */
    previous?: string;
    /** @default "▶️" */
    next?: string;
    /** @default "⏭️" */
    last?: string;
    /** @default "❌" */
    stop?: string;
    /** @default "🔢" */
    jump?: string;
    /** @default "ℹ️" */
    info?: string;
  };
  
  /** 
   * Custom response messages for various paginator states
   * Perfect for adding your own personality or internationalization
   */
  responseMessages?: ResponseMessages;
  
  /** 
   * Whether to show "Page X of Y" in embed footers
   * @default true
   */
  showPageNumbers?: boolean;
  
  /** 
   * Whether only the command author can interact with buttons
   * @default true
   */
  authorOnly?: boolean;
  
  /** 
   * Maximum buttons per row (Discord limit is 5)
   * @default 5
   */
  maxButtonsPerRow?: number;
  
  /** 
   * Whether to enable jump-to-page functionality
   * Adds a button that allows users to jump to specific pages
   * @default false
   */
  allowJumping?: boolean;
  
  /** 
   * Whether to show the page info button
   * Displays detailed information about the current paginator state
   * @default false
   */
  showPageInfo?: boolean;
  
  /** 
   * Whether to loop pages (first -> last, last -> first)
   * When true, navigation wraps around at the edges
   * @default false
   */
  loopPages?: boolean;
}