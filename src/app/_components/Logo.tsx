'use client'

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { darkModeLogo, whiteModeLogo } from "~/constants/consts";

const Logo = () => {
    const { resolvedTheme } = useTheme();
    const [logoSrc, setLogoSrc] = useState<string>(whiteModeLogo);

    useEffect(() => {
        setLogoSrc(resolvedTheme === 'dark' ? darkModeLogo : whiteModeLogo);
    }, [resolvedTheme]);
    return (
        <Image src={logoSrc} alt={'logo'} width={40} height={40} />
    )
}
export default Logo