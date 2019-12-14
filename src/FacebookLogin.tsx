import React from "react";
import useScript from "./useScript";

export type InstagramPlatformScope =
  | "instagram_basic"
  | "instagram_content_publish"
  | "instagram_manage_comments"
  | "instagram_manage_insights";

export type LiveVideoAPIScope = "publish_video";

export type MessengerPlatformScope = "pages_messaging";

export type WhatsAppPlatformScope = "whatsapp_business_management";

export type PagesAndBusinessAssetsScope =
  | "ads_management"
  | "ads_read"
  | "attribution_read"
  | "business_management"
  | "catalog_management"
  | "leads_retrieval"
  | "manage_pages"
  | "pages_manage_cta"
  | "pages_manage_instant_articles"
  | "pages_show_list"
  | "pages_show_list"
  | "publish_pages"
  | "read_insights";

export type UserDataScope =
  | "email"
  | "groups_access_member_info"
  | "publish_to_groups"
  | "user_age_range"
  | "user_birthday"
  | "user_events"
  | "user_friends"
  | "user_gender"
  | "user_hometown"
  | "user_likes"
  | "user_link"
  | "user_location"
  | "user_photos"
  | "user_posts"
  | "user_videos";

export type Scope =
  | UserDataScope
  | PagesAndBusinessAssetsScope
  | WhatsAppPlatformScope
  | MessengerPlatformScope
  | LiveVideoAPIScope
  | InstagramPlatformScope;

export interface IFacebookLoginProps {
  /**
   * This is used to identify your application, and you can fetch one from the
   * app console on the Facebook developer pages.
   */
  appId: string;
  // We won't have any children. Use the render prop to render a custom el instead.
  children: never;
  /**
   * Used to render a custom element instead of the one provided by Facebook.
   */
  render?: (onClick: () => void) => React.ReactNode;
  /**
   * This is used to request certain permissions from the user. By default it fetches
   * - `id`
   * - `first_name`
   * - `last_name`
   * - `middle_name`
   * - `name`
   * - `name_format`
   * - `picture`
   * - `short_name`
   */
  scope?: Array<Scope>;
  fbInitParams?: IFBInitParams;
  loginCallback: FBLoginCallback;
}

/**
 * We need to define the type of the Facebook API functions here to keep typescript
 * from nagging about it not existing.
 *
 * @external "https://developers.facebook.com/docs/javascript/reference/FB.init/v5.0"
 */
interface IFBInitParams {
  appId: string;
  /**
   * Determines which versions of the Graph API and any API dialogs or plugins
   * are invoked when using the .api() and .ui() functions.
   *
   * @external "https://developers.facebook.com/docs/apps/changelog/"
   */
  version: string;
  /**
   * Determines whether a cookie is created for the session or not. If enabled,
   * it can be accessed by server-side code.
   *
   * @default false
   */
  cookie?: boolean;
  /**
   * Determines whether the current login status of the user is freshly
   * retrieved on every page load. If this is disabled, that status will have
   * to be manually retrieved using .getLoginStatus().
   *
   * @default false
   */
  status?: boolean;
  /**
   * Determines whether XFBML tags used by social plugins are parsed, and
   * therefore whether the plugins are rendered or not.
   *
   * @default false
   */
  xfbml?: boolean;
  /**
   * Frictionless Requests are available to games on Facebook.com or on mobile
   * web using the JavaScript SDK. This parameter determines whether they are
   * enabled.
   *
   * @default false
   */
  frictionlessRequests?: boolean;
  /**
   * This specifies a function that is called whenever it is necessary to hide
   * Adobe Flash objects on a page. This is used when .api() requests are made,
   * as Flash objects will always have a higher z-index than any other DOM
   * element. See our Custom Flash Hide Callback for more details on what to
   * put in this function.
   *
   * @default null
   * @external "https://developers.facebook.com/docs/games/gamesonfacebook/optimizing#handlingpopups"
   */
  hideFlashCallback?: unknown;
}

interface IFBLoginOpts {
  auth_type?: "rerequest" | "reauthenticate" | "reauthorize";
  scope: string;
  return_scopes: boolean;
  /**
   * When true, prompt the user to grant permission for one or more Pages
   */
  enable_profile_selector?: boolean;
  profile_selector_ids?: string;
}

interface IFBAuthResponse {
  accessToken: string;
  expiresIn: string;
  signedRequest: string;
  userID: string;
}

interface IFBLoginResponse {
  status: "connected" | "not_authorized" | "unknown";
  authResponse: IFBAuthResponse;
}

type FBLoginCallback = (response: IFBLoginResponse) => void;

declare var FB: {
  init: (params: IFBInitParams) => void;
  login: (cb: FBLoginCallback, opts: IFBLoginOpts) => void;
};

const FacebookLogin: React.FC<IFacebookLoginProps> = props => {
  // This will provide us with the Facebook API.
  useScript("https://connect.facebook.net/en_US/sdk.js");

  // Initialize FB every time we update the AppID.
  React.useEffect(() => {
    FB.init({ version: "v5.0", appId: props.appId, ...props.fbInitParams });
  }, [props.appId]);

  const onClickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    FB.login(props.loginCallback, { scope: "", return_scopes: true });
  };

  return <button onClick={onClickHandler}>Continue with facebook</button>;
};

export default FacebookLogin;
