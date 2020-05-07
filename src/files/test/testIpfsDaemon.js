import Ctl from 'ipfsd-ctl';
import path from 'path';
import ipfsHttpModule from 'ipfs-http-client';

let ipfsd;

export async function spawnIpfsDaemon() {
  const ipfsBin = path.resolve(__dirname, '../', 'node_modules/.bin', 'jsipfs');
  ipfsd = await Ctl.createController({
    type: 'js', disposable: true, test: true, ipfsBin, ipfsHttpModule,
  });
  return ipfsd.apiAddr;
}

export async function shutDownIpfsDaemon() {
  return ipfsd && ipfsd.stop();
}
