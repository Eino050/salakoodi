#!/bin/sh
# Salakoodi-PWA:n käyttöönotto GitHub Pagesiin
set -e
cd "$(dirname "$0")"

git add -A
git commit -m "Salakoodi PWA - ensimmäinen versio" || true
git branch -M main

echo
echo "=================================================="
echo "  Tiedostot valmiina ja commit tehty."
echo "=================================================="
echo
echo "Seuraavat vaiheet käsin:"
echo
echo "  1) Luo tyhjä repo GitHubissa:  https://github.com/new"
echo "     Repon nimi esim: salakoodi  (älä lisää README:tä)"
echo
echo "  2) Yhdistä ja työnnä:"
echo "     git remote add origin https://github.com/<KAYTTAJA>/salakoodi.git"
echo "     git push -u origin main"
echo
echo "  3) GitHubissa: Settings -> Pages ->"
echo "     Source: Deploy from a branch -> main / (root) -> Save"
echo
echo "  4) Odota minuutti, appi löytyy sitten:"
echo "     https://<KAYTTAJA>.github.io/salakoodi/"
echo
echo "Puhelimessa: avaa linkki Chrome/Edge (Android) tai"
echo "Safari (iPhone) -> Jaa -> Lisää aloitusnäyttöön."
echo "Androidilla selain kysyy automaattisesti 'Asenna'."
echo "=================================================="
