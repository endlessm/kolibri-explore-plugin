import { constants } from 'ek-components';

export const testChannel = {
  id: '6199dde695db4ee4ab392222d5af1e5c',
  title: 'My Channel',
  description: 'This is my Channel',
  thumbnail: "\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iMTAwIgogICBoZWlnaHQ9IjEwMCIKICAgdmlld0JveD0iMCAwIDI2LjQ1ODMzMyAyNi40NTgzMzMiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzUiCiAgIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMyIj4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MjMxIj4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2Y0ZWIwMDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AyMjciIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjE1MTU7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMjI5IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MjMxIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MjMzIgogICAgICAgeDE9IjMuMjA3NTUwOCIKICAgICAgIHkxPSIxMi45NjQwMzIiCiAgICAgICB4Mj0iMTguMDY4NDM2IgogICAgICAgeTI9IjEzLjA1NTQ5NiIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiAvPgogIDwvZGVmcz4KICA8ZwogICAgIGlkPSJsYXllcjEiPgogICAgPHJlY3QKICAgICAgIHN0eWxlPSJmaWxsOnVybCgjbGluZWFyR3JhZGllbnQyMzMpO3N0cm9rZS13aWR0aDo0Ljk5OTk5O3BhaW50LW9yZGVyOnN0cm9rZSBmaWxsIG1hcmtlcnM7c3RvcC1jb2xvcjojMDAwMDAwO2ZpbGwtb3BhY2l0eToxIgogICAgICAgaWQ9InJlY3QxMTEiCiAgICAgICB3aWR0aD0iMjYuNDU4MzM0IgogICAgICAgaGVpZ2h0PSIyNi40NTgzMzQiCiAgICAgICB4PSIwIgogICAgICAgeT0iMCIgLz4KICA8L2c+Cjwvc3ZnPgo=\"",
};

export const downloadContentSuccessId = 'success';
export const downloadContentFailureId = 'fail123';

const downloadPollTimes = {};

export default {
  themeRenderer: () => {},
  getChannelMetadata: () => {
    return new Promise(resolve => {
      resolve(testChannel);
    });
  },
  getChannelFilterOptions: () => {
    return new Promise(resolve => {
      resolve({
        availableAuthors: ['Joana', 'Heather', 'Simon'],
        availableTags: ['entertainment', 'education', 'diy'],
        availableKinds: ['video', 'document', 'html5'],
      });
    });
  },
  getContentByFilter: () => {
    return new Promise(resolve => {
      resolve({
        results: [],
      });
    });
  },

  checkContentDownload: (channelId, contentId) => {
    console.debug(['checkContentDownload', channelId, contentId]);
    if (!(contentId in downloadPollTimes)) {
      downloadPollTimes[contentId] = 0;
    }
    return new Promise(resolve => {
      if (downloadPollTimes[contentId] === 0) {
        resolve(constants.DownloadState.READY);
      } else if (downloadPollTimes[contentId] >= 10) {
        if (contentId === downloadContentSuccessId) {
          resolve(constants.DownloadState.COMPLETED);
        }
        else if (contentId === downloadContentFailureId) {
          downloadPollTimes[contentId] = 1;
          resolve(constants.DownloadState.FAILED);
        }
      } else {
        resolve(constants.DownloadState.DOWNLOADING);
      }
      downloadPollTimes[contentId] += 1;
    })
    },

  startContentDownload: (channelId, contentId) => {
    console.debug(['startContentDownload', channelId, contentId]);
    return new Promise(resolve => {
      resolve(constants.DownloadState.DOWNLOADING);
    });
  },

  retryContentDownload: (channelId, contentId) => {
    console.debug(['retryContentDownload', channelId, contentId]);
    return new Promise(resolve => {
      resolve(constants.DownloadState.DOWNLOADING);
    });
  },
}
