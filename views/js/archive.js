$(async function () {
    let response = await fetch(ARCHIVE_URL + "?token=" + sessionStorage.token);
    if (response.ok) {
        let data = await response.json();
        if (data.success) {
            loadArchivedPlaylists(data.archivedPlaylists);
        }
    }
})

function loadArchivedPlaylists(archives) {
    const container = $('#archive-container');

    container.find(".playlist-card").remove();

    if (archives.length === 0) {
        return;
    }else{
        $("#NotFound").hide();
    }

    archives.forEach(function (archive) {
        let image = archive.playlistpicture;
        if (!image && archive.tracks && archive.tracks.length > 0) {
            image = archive.tracks[0].albumImage;
        }
        image = image || "./assets/default-album.png";

        const card = $(`
            <div class="card playlist-card" data-id="${archive._id}">
                <div class="card-image" style="background-image: url('${image}'); background-size: cover; background-position: center;"></div>
                <div class="card-info">
                    <p class="card-title">${archive.name}</p>
                    <p class="card-subtitle">${archive.tracks ? archive.tracks.length : 0} Tracks</p>
                </div>
                <button class="btn-unarchive">Unarchive</button>
            </div>
        `);
        container.append(card);
    });
}