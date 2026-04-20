import React, { type ComponentType, type ReactNode } from 'react';

/**
 * Compose a list of provider components (without their children) into a
 * single nested tree. Order is outermost → innermost, so:
 *   composeProviders([[A, props], [B, props], [C, props]], <Page />)
 * is equivalent to:
 *   <A {...}><B {...}><C {...}><Page /></C></B></A>
 *
 * Lets us avoid the 12-level JSX pyramid in RainbowKitProvider while
 * preserving the exact same provider order (and dependencies — a later
 * provider can still useContext a value supplied by an earlier one).
 */
// Each provider has its own prop shape; we widen to ComponentType<any> so a
// heterogeneous provider list can be expressed in one array.
// biome-ignore lint/suspicious/noExplicitAny: heterogeneous prop shapes
type AnyProvider = ComponentType<any>;
type ProviderEntry = readonly [AnyProvider, Record<string, unknown>];

export function composeProviders(
  providers: readonly ProviderEntry[],
  children: ReactNode,
): ReactNode {
  return providers.reduceRight<ReactNode>(
    (acc, [Component, props]) => React.createElement(Component, props, acc),
    children,
  );
}
