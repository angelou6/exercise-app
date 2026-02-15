import { Href, Link } from "expo-router";
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from "expo-web-browser";
import { type ComponentProps, type ReactNode } from "react";
import { Pressable, TextStyle, type StyleProp } from "react-native";

type Props = Omit<
  ComponentProps<typeof Link>,
  "href" | "style" | "children"
> & {
  href: Href & string;
  style?: StyleProp<TextStyle>;
  children?: ReactNode;
};

export function ExternalLink({ href, style, children, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      asChild
      href={href}
      style={style}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== "web") {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    >
      <Pressable>{children}</Pressable>
    </Link>
  );
}
