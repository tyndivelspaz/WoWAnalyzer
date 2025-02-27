import { Trans } from '@lingui/macro';
import Contributor from 'interface/ContributorButton';
import ReadableListing from 'interface/ReadableListing';
import Config from 'parser/Config';

import SpecIcon from './SpecIcon';

const SpecListItem = ({
  spec,
  exampleReport,
  contributors,
  patchCompatibility,
  isPartial,
}: Config) => {
  const className = spec.className.replace(/ /g, '');
  const Component = exampleReport ? 'a' : 'div';

  const maintainers = (
    <ReadableListing>
      {contributors.map((contributor) => (
        <Contributor key={contributor.nickname} link={false} {...contributor} />
      ))}
    </ReadableListing>
  );

  return (
    <Component
      key={spec.id}
      href={exampleReport}
      title={exampleReport ? 'Open example report' : undefined}
      className="spec-card"
    >
      <div className="icon">
        <figure>
          <SpecIcon spec={spec} />
        </figure>
      </div>
      <div className="description">
        <h4 className={className}>
          {spec.specName} {spec.className}
        </h4>
        {!patchCompatibility ? (
          <Trans id="interface.specListItem.notSupported">Not currently supported</Trans>
        ) : !isPartial ? (
          <Trans id="interface.specListItem.patchCompatability">
            Accurate for patch {patchCompatibility}
          </Trans>
        ) : (
          <Trans id="interface.specListItem.partialPatchCompatability">
            Partial support for patch {patchCompatibility}
          </Trans>
        )}
        <br />
        {contributors.length !== 0 ? (
          <Trans id="interface.specListItem.maintainer">Maintained by: {maintainers}</Trans>
        ) : (
          <small>
            <em>
              <Trans id="interface.specListItem.unmaintained">CURRENTLY UNMAINTAINED</Trans>
            </em>
          </small>
        )}
      </div>
    </Component>
  );
};

export default SpecListItem;
