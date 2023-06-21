---
name: Channel custom presentation request
about: Request a custom presentation for a specific channel.
title: 'Channel override: <channel name>'
labels: ['custom presentation']
assignees: ''

---

Channel ID: (mandatory!)

Styling:
- [ ] Custom primary color? Default: `#091415` (dark gray)
- [ ] Custom secondary color? Default: `#F15A22` (Endless orange)
- [ ] Custom header color? Default `#14BF96` (light green)
- [ ] Custom thumbnail? Provide JPEG file for the channel card
- [ ] Custom icon? Provide PNG that will replace the channel icon uploaded at Kolibri Studio
- [ ] Custom header asset? Provide JPEG file. Otherwise the header color will be used.

Options:
- [ ] Should display as bundle? Default: no. If yes, the last topic is supposed to have content that should be read or played side-by-side. Eg. a video and its corresponding lecture.
- [ ] Should force flat display? Default: no. The flat presentation ignores all topics hierarchy. It displays all content in the channel page. Don't use unless this can't be done in Kolibri Studio (channels we don't own).
- [ ] Is an Endless curated channel? Default: no. If yes the channel footer and channel card has the Endless branding.
- [ ] Has search section? Default: yes
- [ ] Has carousel section? Default: yes
- [ ] Has filters section? Default: yes
- [ ] Has dark header? Default: no. Needed when the header asset or header color is dark, to use light text over it.
- [ ] Display logo in header? Default: yes
