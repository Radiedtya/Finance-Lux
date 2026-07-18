import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img
            src="/images/flx.png"
            alt="FinanceLux"
            className={props.className}
            style={props.style}
        />
    );
}