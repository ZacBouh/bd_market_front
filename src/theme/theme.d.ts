import { Theme } from "@mui/material/styles"

declare module "@mui/material/styles" {
    interface Theme {
        custom: {
            sideMenuWidth: number
        }
    }

    interface ThemeOptions {
        custom?: {
            sideMenuWidth: number
        }
    }
}