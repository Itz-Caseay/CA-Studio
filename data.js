/*
  CA_Studio: edit this file to change the content on all three pages.
  Empty values stay hidden. Images are picked up from the images/ folders (see the README files in each).
*/
window.CA = {
  // Shows in the footer and on the label page ("Send your demo")
  email: '',

  // Add a link to show it in the footer
  socials: { Instagram: '', X: '', YouTube: 'https://www.youtube.com/@Caseay-c8g', LinkedIn: '' },

  // HOME: team photos. Leave empty to auto-load images/team/team-1.jpg, team-2.jpg ...
  // Or list them: [{ image: 'images/team/ada.jpg', name: 'Ada', role: 'Engineer' }]
  team: [
    { image: 'images/team/team-1.jfif', name: 'Caseay', role: 'Engineer & Founder' }
  ],

  // HOME: ambitions (image: images/ambitions/ambition-1.jpg, ambition-2.jpg ... or set `image`)
  ambitions: [
    { title: 'Build your own lane', text: 'No imitation. Original work, made on our own terms.', image: 'images/ambitions/ambition-1.jpg' },
    { title: 'Define your own standards', text: 'Ambition and precision in every record and every release.', image: '' },
    { title: 'Create without limits', text: 'No predefined limits. Sound meets code, creativity meets strategy.', image: '' },
    { title: 'Sing without limits', text: 'Get the notes off your heads. Creativity meets strategy.', image: 'images/ambitions/ambition-4.avif' }
  ],

  // STARTUP: every project. Image: images/projects/<slug>.jpg or set `image`.
  projects: [
    { slug: 'bluebook', name: 'Bluebook', tagline: 'An educative online-platform', status: 'Pending', tags: [], link: 'https://github.com/Itz-Caseay/Bluebook_V0.2', image: 'images/projects/project-1.png' },
    { slug: 'tic-bus', name: 'TiC Bus', tagline: 'Built for travel agencies.', status: 'Pending', tags: [], link: 'https://github.com/Itz-Caseay/TiC_Bus', image: 'images/projects/project-2.png' },
    { slug: 'caseay', name: 'Caseay', tagline: 'Artist website', status: 'Completed', tags: [], link: 'https://thatguapman.vercel.app', image: 'images/projects/project-3.png' },
    { slug: 'edutrack', name: 'Edutrack', tagline: 'A platform to track teachers\' time rate in school.', status: 'Pending', tags: [], link: 'https://github.com/Itz-Caseay/EduTrack_Plus', image: 'images/projects/project-4.png' },
    { slug: 'vora', name: 'VORA', tagline: 'A cab reserver, similar to TiC Bus.', status: '', tags: [], link: 'https://github.com/Itz-Caseay/vora-smart-mobility', image: '' }
  ],

  // LABEL: every signed artist. Clicking a card opens artist.html with their songs.
  // Portrait: images/artists/<slug>.jpg or set `image`. `link` is their own website (optional).
  // songs: title, streams (e.g. '1.4K+'), note (e.g. 'feat. X'), status (e.g. 'Coming soon' for unreleased),
  //        audio (default: audio/<artist-slug>/<song-name>.mp3), link (streaming link, optional)
  artists: [
    {
      slug: 'caseay', name: 'Caseay', genre: '', link: 'https://thatguapman.vercel.app', image: 'images/artists/artist-1.jpg',
      songs: [
        { title: 'Chase Him', streams: '1.4K+' },
        { title: '#RAM', streams: '450+' },
        { title: 'Bold', note: 'feat. Tonni SS', status: 'Coming soon' }
      ]
    }
  ]
};
