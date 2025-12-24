# Error : 
    - Everything in Double Call : StrictMode in main.tsx or index.tsx & it will not come in production mode, remove it from main.tsx if you dont want in development mode
    - drop console from vite.config.js file...

# Issue & Next Update 
1. Hide Non Video Participants, work only desktop mode..''
2. Enter Button : Login ...

# Admin 
1. Coins Function [Coins Start Date & Coins Expired Date]
    - Total Coins = 100 
    - Remaining Coins = 94 
    - Used Coins = 6 (Calculate From Coins Start Date)
    - Remaining Coins Validated
        - Coins Start Date 01/12/2025  & Total Coins 20
        - Coins Current Date 24/12/2025 , Then remaining coins will be zero instead of minus By Api ... & Expired
    - OnEdit : 
        - if user coins increase then its OK
        - if user coins decrease then validation Ex.
            i. Coins Start Date 01/12/2025 & Total Coins 20 & Coins Will Be Expired at 20/12/2025
            ii. Coins Current Date 08/12/2025 & Used Coins 08, Remaining Coins 12, Total Coins 20
            ii. [ForNewCoinsEntry] : Coins Current Date 08/12/2025 
                Phase One : New Total Coins 15, Used Coins 08, Remaining Coins 7 
                            - Now Coins will be expired at 15/12/2025

                Phase Two : New Total Coins 12, Used Coins 08, Remaining Coins 4  
                            - Now Coins will be expired at 12/12/2025

                Coins Current Date : 14/12/2025
                Phase Three : New Total Coins 12, Used Coins 12, Remaining Coins 0  
                            - Now Coins will be expired at 12/12/2025
                            - if current_data > coins_expired_at then it throw error


2. Admin on Coins Function
    - do not authorized to Reset Coins Button
    - do not authorized to delete the user


